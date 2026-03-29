import api from "@/services/api";

type SpotifyAccessTokenResponse = {
  accessToken: string;
  expiresAt: string;
};

const MAX_SPOTIFY_API_RETRIES = 3;
const INITIAL_RETRY_DELAY_MS = 500;
let sdkLoadPromise: Promise<void> | null = null;
let spotifyPlayerInstance: Spotify.Player | null = null;
let tokenCache: { token: string; expiresAt: number } | null = null;

const SPOTIFY_SDK_URL = "https://sdk.scdn.co/spotify-player.js";

export const isMobilePlaybackEnvironment = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.innerWidth < 768 ||
    /android|iphone|ipad|ipod|mobile/i.test(window.navigator.userAgent)
  );
};

export const loadSpotifySdk = () => {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Spotify SDK can only load in the browser."));
  }

  if (window.Spotify) {
    return Promise.resolve();
  }

  if (sdkLoadPromise) {
    return sdkLoadPromise;
  }

  sdkLoadPromise = new Promise<void>((resolve, reject) => {
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${SPOTIFY_SDK_URL}"]`,
    );

    const handleReady = () => resolve();

    window.onSpotifyWebPlaybackSDKReady = handleReady;

    if (existingScript) {
      existingScript.addEventListener("error", () =>
        reject(new Error("Failed to load Spotify SDK.")),
      );
      return;
    }

    const script = document.createElement("script");
    script.src = SPOTIFY_SDK_URL;
    script.async = true;
    script.onerror = () => reject(new Error("Failed to load Spotify SDK."));
    document.body.appendChild(script);
  });

  return sdkLoadPromise;
};

export const clearSpotifyAccessTokenCache = () => {
  tokenCache = null;
};

export const disconnectSpotifyPlayer = () => {
  if (spotifyPlayerInstance) {
    spotifyPlayerInstance.disconnect();
    spotifyPlayerInstance = null;
  }

  clearSpotifyAccessTokenCache();
};

export const getSpotifyPlayerInstance = () => spotifyPlayerInstance;

export const initializeSpotifyPlayer = async () => {
  await loadSpotifySdk();

  if (spotifyPlayerInstance || !window.Spotify) {
    return spotifyPlayerInstance;
  }

  spotifyPlayerInstance = new window.Spotify.Player({
    name: "PlaylistHub Web Player",
    volume: 0.7,
    getOAuthToken: async (callback) => {
      const token = await getSpotifyWebAccessToken();
      callback(token);
    },
  });

  return spotifyPlayerInstance;
};

export const getSpotifyWebAccessToken = async () => {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 15_000) {
    return tokenCache.token;
  }

  const response = await api.get<SpotifyAccessTokenResponse>("/spotify/access-token");
  const expiresAt = new Date(response.data.expiresAt).getTime();

  tokenCache = {
    token: response.data.accessToken,
    expiresAt,
  };

  return response.data.accessToken;
};

const wait = (ms: number) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });

const getRetryDelayMs = (response: Response, attempt: number) => {
  const retryAfterSeconds = Number(response.headers.get("Retry-After"));

  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
    return retryAfterSeconds * 1000;
  }

  return INITIAL_RETRY_DELAY_MS * 2 ** attempt;
};

const getSpotifyApiErrorMessage = (
  status: number,
  fallbackMessage: string,
  payload?: { error?: { message?: string } },
) => {
  const apiMessage = payload?.error?.message?.trim();

  if (apiMessage) {
    return apiMessage;
  }

  if (status === 401) {
    return "Your Spotify session expired. Reconnect Spotify and try again.";
  }

  if (status === 403) {
    return "Spotify rejected this action. Premium playback or an active device may be required.";
  }

  if (status === 404) {
    return "Spotify could not find an active playback device.";
  }

  if (status === 429) {
    return "Spotify rate limited playback requests. Please wait a moment and try again.";
  }

  return fallbackMessage;
};

const spotifyApiRequest = async (
  method: string,
  path: string,
  body?: Record<string, unknown>,
) => {
  for (let attempt = 0; attempt <= MAX_SPOTIFY_API_RETRIES; attempt += 1) {
    const accessToken = await getSpotifyWebAccessToken();
    const response = await fetch(`https://api.spotify.com/v1${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401 && attempt === 0) {
      clearSpotifyAccessTokenCache();
      continue;
    }

    if (response.status === 429 && attempt < MAX_SPOTIFY_API_RETRIES) {
      await wait(getRetryDelayMs(response, attempt));
      continue;
    }

    if (!response.ok && response.status !== 204) {
      const fallbackMessage = `Spotify request failed (${response.status})`;
      let payload:
        | {
            error?: { message?: string };
          }
        | undefined;

      try {
        payload = (await response.json()) as { error?: { message?: string } };
      } catch {
        payload = undefined;
      }

      throw new Error(
        getSpotifyApiErrorMessage(response.status, fallbackMessage, payload),
      );
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  throw new Error(
    "Spotify rate limited playback requests. Please wait a moment and try again.",
  );
};

export const transferPlaybackToDevice = async (deviceId: string) => {
  await spotifyApiRequest("PUT", "/me/player", {
    device_ids: [deviceId],
    play: false,
  });
};

export const startSpotifyPlayback = async (deviceId: string, uris: string[]) => {
  await spotifyApiRequest(
    "PUT",
    `/me/player/play?device_id=${encodeURIComponent(deviceId)}`,
    { uris },
  );
};

export const toggleSpotifyPlayback = async () => {
  const player = getSpotifyPlayerInstance();

  if (!player) {
    throw new Error("Spotify player is not ready yet.");
  }

  await player.togglePlay();
};

export const playNextSpotifyTrack = async () => {
  const player = getSpotifyPlayerInstance();

  if (!player) {
    throw new Error("Spotify player is not ready yet.");
  }

  await player.nextTrack();
};

export const playPreviousSpotifyTrack = async () => {
  const player = getSpotifyPlayerInstance();

  if (!player) {
    throw new Error("Spotify player is not ready yet.");
  }

  await player.previousTrack();
};

export const seekSpotifyTrack = async (positionMs: number) => {
  const player = getSpotifyPlayerInstance();

  if (!player) {
    throw new Error("Spotify player is not ready yet.");
  }

  await player.seek(positionMs);
};

export const setSpotifyPlayerVolume = async (volumePercent: number) => {
  const player = getSpotifyPlayerInstance();

  if (!player) {
    throw new Error("Spotify player is not ready yet.");
  }

  await player.setVolume(Math.max(0, Math.min(1, volumePercent / 100)));
};
