import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ApiError from "../../utils/ApiError.js";
import { User } from "../../models/user.model.js";
import { decryptText, encryptText } from "../../utils/crypto.js";
import { setAuthCookies } from "../../utils/authCookies.js";
import { serializeAuthUser } from "../../utils/serializeAuthUser.js";
import { getAccessToken, getRefreshToken } from "../../utils/signJwt.js";
import {
  buildSpotifyAuthorizationUrl,
  exchangeSpotifyCode,
  fetchSpotifyProfile,
  getSpotifyRedirectUri,
  refreshSpotifyUserAccessToken,
} from "../../services/spotifyUserAuth.service.js";

dotenv.config();

const defaultFrontendBaseUrl = "http://127.0.0.1:5173";

const getStateSecret = () =>
  process.env.SPOTIFY_STATE_SECRET || process.env.ACCESS_TOKEN_SECRET;

const getFrontendBaseUrl = () =>
  (
    process.env.FRONTEND_BASE_URL ||
    process.env.BASE_URL ||
    defaultFrontendBaseUrl
  )
    .split(",")
    .map((origin) => origin.trim())
    .find(Boolean) || defaultFrontendBaseUrl;

const sanitizeReturnTo = (value) => {
  if (typeof value !== "string" || !value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
};

const buildFrontendCallbackUrl = ({ code, state, error }) => {
  const callbackUrl = new URL("/auth/spotify/callback", getFrontendBaseUrl());

  if (code) {
    callbackUrl.searchParams.set("code", code);
  }

  if (state) {
    callbackUrl.searchParams.set("state", state);
  }

  if (error) {
    callbackUrl.searchParams.set("error", error);
  }

  return callbackUrl.toString();
};

const createSpotifyState = (payload) => {
  const secret = getStateSecret();

  if (!secret) {
    throw new Error("Missing Spotify OAuth state secret");
  }

  return jwt.sign(payload, secret, { expiresIn: "10m" });
};

const verifySpotifyState = (state) => {
  const secret = getStateSecret();

  if (!secret) {
    throw new Error("Missing Spotify OAuth state secret");
  }

  return jwt.verify(state, secret);
};

const applySpotifyTokensToUser = (user, spotifyProfile, tokenPayload) => {
  const expiresInSeconds = Number(tokenPayload.expires_in ?? 3600);

  user.authMethods = {
    local: user.authMethods?.local !== false,
    spotify: true,
  };
  user.spotify = {
    accountId: spotifyProfile.id,
    displayName:
      spotifyProfile.display_name ||
      spotifyProfile.id ||
      user.spotify?.displayName ||
      "",
    email: spotifyProfile.email || user.spotify?.email || user.email,
    product: spotifyProfile.product || "",
    country: spotifyProfile.country || "",
    refreshToken: tokenPayload.refresh_token
      ? encryptText(tokenPayload.refresh_token)
      : user.spotify?.refreshToken || "",
    accessToken: tokenPayload.access_token || "",
    accessTokenExpiresAt: new Date(
      Date.now() + Math.max(expiresInSeconds - 60, 60) * 1000,
    ),
  };
};

const toStoredSpotifyProfile = (spotifyData) => ({
  id: spotifyData.accountId || spotifyData.id || "",
  display_name: spotifyData.displayName || spotifyData.display_name || "",
  email: spotifyData.email || "",
  product: spotifyData.product || "",
  country: spotifyData.country || "",
});

const clearSpotifyData = (user) => {
  user.authMethods = {
    local: user.authMethods?.local !== false,
    spotify: false,
  };
  user.spotify = {
    accountId: "",
    displayName: "",
    email: "",
    product: "",
    country: "",
    refreshToken: "",
    accessToken: "",
    accessTokenExpiresAt: null,
  };
};

const getSpotifyStatusPayload = (user) => ({
  connected: Boolean(user.authMethods?.spotify && user.spotify?.accountId),
  product: user.spotify?.product ?? "",
  displayName: user.spotify?.displayName ?? "",
  accountId: user.spotify?.accountId ?? "",
});

const generateSpotifyUsername = async (spotifyProfile) => {
  const seed =
    spotifyProfile.display_name ||
    spotifyProfile.email?.split("@")[0] ||
    `spotify_${spotifyProfile.id.slice(-6)}`;

  const normalizedSeed = seed
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 20) || `spotify_${spotifyProfile.id.slice(-6)}`;

  let nextUsername = normalizedSeed;
  let suffix = 1;

  while (await User.findOne({ username: nextUsername }).select("_id")) {
    nextUsername = `${normalizedSeed.slice(0, 16)}_${suffix}`;
    suffix += 1;
  }

  return nextUsername;
};

const finalizeAuthResponse = async (user, res) => {
  const accessToken = getAccessToken(user);
  const refreshToken = getRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setAuthCookies(res, accessToken, refreshToken);
};

const normalizeSpotifyAuthError = (error) => {
  if (error instanceof ApiError) {
    return error;
  }

  const statusCode = Number(error?.response?.status) || 500;
  const message =
    error?.response?.data?.error_description ||
    error?.response?.data?.error?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "Spotify authentication failed.";

  return new ApiError(statusCode, message);
};

const completeSpotifyPkceAuth = async ({ code, state, codeVerifier, res }) => {
  if (!code || !state || !codeVerifier) {
    throw new ApiError(400, "Missing Spotify PKCE callback parameters");
  }

  const decodedState = verifySpotifyState(String(state));
  const intent = decodedState.intent === "link" ? "link" : "login";
  const returnTo = sanitizeReturnTo(decodedState.returnTo);
  const redirectUri =
    typeof decodedState.redirectUri === "string" && decodedState.redirectUri
      ? decodedState.redirectUri
      : getSpotifyRedirectUri();

  const tokenPayload = await exchangeSpotifyCode({
    code: String(code),
    redirectUri,
    codeVerifier: String(codeVerifier),
  });
  const spotifyProfile = await fetchSpotifyProfile(tokenPayload.access_token);

  const existingLinkedUser = await User.findOne({
    "spotify.accountId": spotifyProfile.id,
    "authMethods.spotify": true,
  });

  if (intent === "link") {
    if (!decodedState.userId) {
      throw new ApiError(401, "Spotify link session is invalid");
    }

    const user = await User.findById(decodedState.userId).select(
      "username email image savedPlaylists authMethods spotify refreshToken",
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (
      existingLinkedUser &&
      existingLinkedUser._id.toString() !== user._id.toString()
    ) {
      throw new ApiError(409, "This Spotify account is already linked");
    }

    if (
      user.authMethods?.spotify &&
      user.spotify?.accountId &&
      user.spotify.accountId !== spotifyProfile.id
    ) {
      throw new ApiError(
        409,
        "Another Spotify account is already linked. Unlink it first.",
      );
    }

    applySpotifyTokensToUser(user, spotifyProfile, tokenPayload);
    await finalizeAuthResponse(user, res);

    return {
      returnTo,
      user: serializeAuthUser(user),
      spotify: getSpotifyStatusPayload(user),
    };
  }

  if (existingLinkedUser) {
    applySpotifyTokensToUser(existingLinkedUser, spotifyProfile, tokenPayload);
    await finalizeAuthResponse(existingLinkedUser, res);

    return {
      returnTo,
      user: serializeAuthUser(existingLinkedUser),
      spotify: getSpotifyStatusPayload(existingLinkedUser),
    };
  }

  const normalizedSpotifyEmail = spotifyProfile.email?.trim().toLowerCase();
  const existingUserWithEmail = normalizedSpotifyEmail
    ? await User.findOne({ email: normalizedSpotifyEmail }).select(
        "username email image savedPlaylists authMethods spotify refreshToken",
      )
    : null;

  if (existingUserWithEmail && !existingUserWithEmail.authMethods?.spotify) {
    throw new ApiError(
      409,
      "A PlaylistHub account already uses this email. Sign in and link Spotify from your profile.",
    );
  }

  if (
    existingUserWithEmail &&
    existingUserWithEmail.authMethods?.spotify &&
    existingUserWithEmail.spotify?.accountId &&
    existingUserWithEmail.spotify.accountId !== spotifyProfile.id
  ) {
    throw new ApiError(
      409,
      "This Spotify email is already connected to another PlaylistHub account.",
    );
  }

  const createdUser = await User.create({
    username: await generateSpotifyUsername(spotifyProfile),
    email: normalizedSpotifyEmail || `${spotifyProfile.id}@spotify.playlisthub.local`,
    password: undefined,
    authMethods: {
      local: false,
      spotify: true,
    },
    spotify: {
      accountId: spotifyProfile.id,
      displayName: spotifyProfile.display_name || spotifyProfile.id,
      email: normalizedSpotifyEmail || "",
      product: spotifyProfile.product || "",
      country: spotifyProfile.country || "",
      refreshToken: tokenPayload.refresh_token
        ? encryptText(tokenPayload.refresh_token)
        : "",
      accessToken: tokenPayload.access_token || "",
      accessTokenExpiresAt: new Date(
        Date.now() + Math.max(Number(tokenPayload.expires_in ?? 3600) - 60, 60) * 1000,
      ),
    },
  });

  await finalizeAuthResponse(createdUser, res);

  return {
    returnTo,
    user: serializeAuthUser(createdUser),
    spotify: getSpotifyStatusPayload(createdUser),
  };
};

export const getValidSpotifyAccessTokenForUser = async (user) => {
  if (!user.authMethods?.spotify || !user.spotify?.accountId) {
    throw new ApiError(400, "Spotify account is not connected");
  }

  const expiresAt = user.spotify.accessTokenExpiresAt
    ? new Date(user.spotify.accessTokenExpiresAt).getTime()
    : 0;

  if (user.spotify.accessToken && expiresAt > Date.now() + 15_000) {
    return {
      accessToken: user.spotify.accessToken,
      expiresAt: user.spotify.accessTokenExpiresAt,
    };
  }

  if (!user.spotify.refreshToken) {
    throw new ApiError(401, "Spotify session expired. Please reconnect Spotify.");
  }

  try {
    const refreshedTokens = await refreshSpotifyUserAccessToken(
      decryptText(user.spotify.refreshToken),
    );

    applySpotifyTokensToUser(
      user,
      toStoredSpotifyProfile(user.spotify),
      refreshedTokens,
    );
    await user.save({ validateBeforeSave: false });

    return {
      accessToken: user.spotify.accessToken,
      expiresAt: user.spotify.accessTokenExpiresAt,
    };
  } catch (error) {
    user.spotify.accessToken = "";
    user.spotify.accessTokenExpiresAt = null;
    await user.save({ validateBeforeSave: false });

    throw normalizeSpotifyAuthError(error);
  }
};

export const startSpotifyAuth = async (req, res, next) => {
  try {
    const intent = req.query.intent === "link" ? "link" : "login";
    const returnTo = sanitizeReturnTo(String(req.query.returnTo || "/"));
    const redirectUri = getSpotifyRedirectUri();
    console.log("[Spotify Auth] redirect_uri being sent:", redirectUri);
    const codeChallenge = String(req.query.codeChallenge || "").trim();
    const codeChallengeMethod = String(
      req.query.codeChallengeMethod || "S256",
    ).trim();

    if (!/^[A-Za-z0-9_-]{43,128}$/.test(codeChallenge)) {
      throw new ApiError(400, "Invalid Spotify PKCE code challenge");
    }

    if (codeChallengeMethod !== "S256") {
      throw new ApiError(400, "Spotify PKCE requires S256 code challenge method");
    }

    if (intent === "link" && !req.user?.id) {
      throw new ApiError(401, "Login required to link Spotify");
    }

    const state = createSpotifyState({
      intent,
      returnTo,
      userId: intent === "link" ? req.user.id : null,
      redirectUri,
    });

    res.redirect(
      buildSpotifyAuthorizationUrl({
        state,
        redirectUri,
        codeChallenge,
        codeChallengeMethod,
      }),
    );
  } catch (error) {
    next(error);
  }
};

export const handleSpotifyCallback = async (req, res) => {
  const { code, state, error } = req.query;

  return res.redirect(
    buildFrontendCallbackUrl({
      code: typeof code === "string" ? code : "",
      state: typeof state === "string" ? state : "",
      error: typeof error === "string" ? error : "",
    }),
  );
};

export const exchangeSpotifyAuthCode = async (req, res, next) => {
  try {
    const authResult = await completeSpotifyPkceAuth({
      code: req.body?.code,
      state: req.body?.state,
      codeVerifier: req.body?.codeVerifier,
      res,
    });

    res.status(200).json({
      success: true,
      returnTo: authResult.returnTo,
      user: authResult.user,
      spotify: authResult.spotify,
    });
  } catch (error) {
    next(normalizeSpotifyAuthError(error));
  }
};

export const getSpotifyStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("authMethods spotify");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(getSpotifyStatusPayload(user));
  } catch (error) {
    next(error);
  }
};

export const unlinkSpotifyAccount = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "username email image savedPlaylists authMethods spotify refreshToken",
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!user.authMethods?.spotify || !user.spotify?.accountId) {
      throw new ApiError(400, "Spotify is not connected");
    }

    if (user.authMethods?.local === false) {
      throw new ApiError(
        400,
        "This account only supports Spotify sign in. Add local auth before unlinking.",
      );
    }

    clearSpotifyData(user);
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Spotify account unlinked",
      user: serializeAuthUser(user),
      spotify: getSpotifyStatusPayload(user),
    });
  } catch (error) {
    next(error);
  }
};

export const getFrontendSpotifyAccessToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("authMethods spotify");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const token = await getValidSpotifyAccessTokenForUser(user);

    res.status(200).json({
      accessToken: token.accessToken,
      expiresAt: token.expiresAt,
      product: user.spotify?.product ?? "",
      accountId: user.spotify?.accountId ?? "",
    });
  } catch (error) {
    next(error);
  }
};
