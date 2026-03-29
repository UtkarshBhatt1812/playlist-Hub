import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import {
  clearPlayerError,
  queuePlayback,
  setMobileFallback,
  setPlayerError,
  setPositionMs,
  setVolume,
} from "@/features/player/playerSlice";
import type { PlaybackRequest } from "@/features/player/player.types";
import { startSpotifyAuthFlow } from "@/lib/spotifyAuth";
import api from "@/services/api";
import {
  isMobilePlaybackEnvironment,
  playNextSpotifyTrack,
  playPreviousSpotifyTrack,
  seekSpotifyTrack,
  setSpotifyPlayerVolume,
  toggleSpotifyPlayback,
} from "@/services/spotifyPlayer";

const openSpotifyWindow = (url: string) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

export const useSpotifyPlayback = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authUser = useAppSelector((state) => state.auth.user);
  const player = useAppSelector((state) => state.player);

  const startSpotifyLinking = async (
    returnTo = `${window.location.pathname}${window.location.search}`,
  ) => {
    console.log("this is ",returnTo)
    if (!authUser.isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      await api.post("/auth/refresh");
    } catch {

      // If refresh fails here, the backend start route will reject the link attempt.
      throw new Error("Your session has expired. Please log in again to connect Spotify.");
    }

    try {
      await startSpotifyAuthFlow("link", returnTo);
    } catch (error) {
      dispatch(
        setPlayerError(
          error instanceof Error
            ? error.message
            : "Failed to start Spotify authentication.",
        ),
      );
    }
  };

  const requestPlayback = async (request: PlaybackRequest) => {
    if (!authUser.isAuthenticated) {
      navigate("/login");
      return false;
    }

    if (!authUser.spotifyConnected) {
      dispatch(setPlayerError("Connect Spotify to start playback."));
      return false;
    }

    if (isMobilePlaybackEnvironment()) {
      dispatch(clearPlayerError());
      dispatch(
        setMobileFallback({
          url: request.fallbackUrl,
          meta: request.meta,
        }),
      );
      openSpotifyWindow(request.fallbackUrl);
      return true;
    }

    if (authUser.spotifyProduct.toLowerCase() !== "premium") {
      dispatch(setPlayerError("Spotify Premium is required for browser playback."));
      return false;
    }

    dispatch(clearPlayerError());

    dispatch(queuePlayback(request));
    return true;
  };

  const togglePlayPause = async () => {
    if (isMobilePlaybackEnvironment()) {
      if (player.mobileFallbackUrl) {
        openSpotifyWindow(player.mobileFallbackUrl);
        return;
      }

      dispatch(setPlayerError("Playback opens in Spotify on mobile."));
      return;
    }

    try {
      dispatch(clearPlayerError());
      await toggleSpotifyPlayback();
    } catch (error) {
      dispatch(
        setPlayerError(
          error instanceof Error ? error.message : "Failed to toggle playback.",
        ),
      );
    }
  };

  const playNext = async () => {
    try {
      dispatch(clearPlayerError());
      await playNextSpotifyTrack();
    } catch (error) {
      dispatch(
        setPlayerError(
          error instanceof Error ? error.message : "Failed to skip track.",
        ),
      );
    }
  };

  const playPrevious = async () => {
    try {
      dispatch(clearPlayerError());
      await playPreviousSpotifyTrack();
    } catch (error) {
      dispatch(
        setPlayerError(
          error instanceof Error ? error.message : "Failed to go to previous track.",
        ),
      );
    }
  };

  const seekTo = async (positionMs: number) => {
    try {
      await seekSpotifyTrack(positionMs);
      dispatch(setPositionMs(positionMs));
    } catch (error) {
      dispatch(
        setPlayerError(
          error instanceof Error ? error.message : "Failed to seek track.",
        ),
      );
    }
  };

  const updateVolume = async (volumePercent: number) => {
    try {
      await setSpotifyPlayerVolume(volumePercent);
      dispatch(setVolume(volumePercent));
    } catch (error) {
      dispatch(
        setPlayerError(
          error instanceof Error ? error.message : "Failed to change volume.",
        ),
      );
    }
  };

  const openMobileFallback = () => {
    if (!player.mobileFallbackUrl) {
      return;
    }

    openSpotifyWindow(player.mobileFallbackUrl);
  };

  return {
    openMobileFallback,
    playNext,
    playPrevious,
    requestPlayback,
    seekTo,
    startSpotifyLinking,
    togglePlayPause,
    updateVolume,
  };
};
