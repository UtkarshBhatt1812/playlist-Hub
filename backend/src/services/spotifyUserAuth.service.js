import axios from "axios";
import dotenv from "dotenv";
import { apiSpotify } from "../api/apiSpotify.js";

dotenv.config();

export const SPOTIFY_PLAYBACK_SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state",
];

const spotifyAccountsClient = axios.create({
  baseURL: "https://accounts.spotify.com",
});

const defaultFrontendBaseUrl = "http://127.0.0.1:5173";

const getSpotifyClientId = () => {
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim();

  if (!clientId) {
    throw new Error("Missing Spotify client ID");
  }

  return clientId;
};

const getConfiguredFrontendBaseUrl = () =>
  (
    process.env.FRONTEND_BASE_URL ||
    process.env.BASE_URL ||
    defaultFrontendBaseUrl
  )
    .split(",")
    .map((origin) => origin.trim())
    .find(Boolean) || defaultFrontendBaseUrl;

export const getSpotifyRedirectUri = () =>
  process.env.SPOTIFY_REDIRECT_URI?.trim() ||
  new URL("/auth/spotify/callback", getConfiguredFrontendBaseUrl()).toString();

export const buildSpotifyAuthorizationUrl = ({
  state,
  redirectUri,
  codeChallenge,
  codeChallengeMethod = "S256",
}) => {
  const url = new URL("https://accounts.spotify.com/authorize");

  url.searchParams.set("client_id", getSpotifyClientId());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("redirect_uri",redirectUri );
  url.searchParams.set("scope", SPOTIFY_PLAYBACK_SCOPES.join(" "));
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge_method", codeChallengeMethod);
  url.searchParams.set("code_challenge", codeChallenge);
  console.log("spotify url : ",url.toString())
  return url.toString();
};

export const exchangeSpotifyCode = async ({
  code,
  redirectUri,
  codeVerifier,
}) => {
  const response = await spotifyAccountsClient.post(
    "/api/token",
    new URLSearchParams({
      client_id: getSpotifyClientId(),
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data;
};

export const refreshSpotifyUserAccessToken = async (refreshToken) => {
  const response = await spotifyAccountsClient.post(
    "/api/token",
    new URLSearchParams({
      client_id: getSpotifyClientId(),
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data;
};

export const fetchSpotifyProfile = async (accessToken) => {
  const response = await apiSpotify.get("/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response.data;
};
