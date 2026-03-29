import { BASE_URL } from "../../config";

export type SpotifyAuthIntent = "login" | "link";

const PKCE_VERIFIER_STORAGE_KEY = "spotify_pkce_code_verifier";

const encodeBase64Url = (buffer: ArrayBuffer | Uint8Array) => {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let output = "";

  bytes.forEach((value) => {
    output += String.fromCharCode(value);
  });

  return window
    .btoa(output)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
};

const createCodeVerifier = () => {
  const bytes = new Uint8Array(64);
  window.crypto.getRandomValues(bytes);

  return encodeBase64Url(bytes);
};

const createCodeChallenge = async (codeVerifier: string) => {
  const encodedVerifier = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", encodedVerifier);

  return encodeBase64Url(digest);
};

const storeSpotifyPkceVerifier = (codeVerifier: string) => {
  window.sessionStorage.setItem(PKCE_VERIFIER_STORAGE_KEY, codeVerifier);
};

export const getStoredSpotifyPkceVerifier = () =>
  window.sessionStorage.getItem(PKCE_VERIFIER_STORAGE_KEY);

export const clearStoredSpotifyPkceVerifier = () => {
  window.sessionStorage.removeItem(PKCE_VERIFIER_STORAGE_KEY);
};

export const buildSpotifyAuthStartUrl = (
  intent: SpotifyAuthIntent,
  returnTo = "/",
  codeChallenge: string,
  codeChallengeMethod = "S256",
) => {
  const url = new URL(`${BASE_URL}/api/v1/auth/spotify/start`);

  url.searchParams.set("intent", intent);
  url.searchParams.set("returnTo", returnTo.startsWith("/") ? returnTo : "/");
  url.searchParams.set("codeChallenge", codeChallenge);
  url.searchParams.set("codeChallengeMethod", codeChallengeMethod);

  return url.toString();
};

export const startSpotifyAuthFlow = async (
  intent: SpotifyAuthIntent,
  returnTo = "/",
) => {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    throw new Error("Spotify PKCE requires a secure browser context.");
  }

  const codeVerifier = createCodeVerifier();
  const codeChallenge = await createCodeChallenge(codeVerifier);

  storeSpotifyPkceVerifier(codeVerifier);
  window.location.assign(buildSpotifyAuthStartUrl(intent, returnTo, codeChallenge));
};
