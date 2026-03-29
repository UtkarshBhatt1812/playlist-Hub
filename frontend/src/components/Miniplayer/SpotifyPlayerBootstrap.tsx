import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import {
  clearMobileFallback,
  clearPendingPlayback,
  resetPlayerState,
  setConnectionStatus,
  setDeviceId,
  setPlaybackState,
  setPlayerError,
  setSdkStatus,
  setVolume,
} from "@/features/player/playerSlice";
import type { PlayerRepeatMode } from "@/features/player/player.types";
import {
  disconnectSpotifyPlayer,
  initializeSpotifyPlayer,
  isMobilePlaybackEnvironment,
  startSpotifyPlayback,
  transferPlaybackToDevice,
} from "@/services/spotifyPlayer";

const mapRepeatMode = (repeatMode: 0 | 1 | 2): PlayerRepeatMode => {
  if (repeatMode === 1) {
    return "context";
  }

  if (repeatMode === 2) {
    return "track";
  }

  return "off";
};

const SpotifyPlayerBootstrap: React.FC = () => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const playerState = useAppSelector((state) => state.player);

  useEffect(() => {
    const isEligibleDesktopPlayback =
      authUser.isAuthenticated &&
      authUser.spotifyConnected &&
      authUser.spotifyProduct.toLowerCase() === "premium" &&
      !isMobilePlaybackEnvironment();

    if (!authUser.isAuthenticated || !authUser.spotifyConnected) {
      disconnectSpotifyPlayer();
      dispatch(resetPlayerState());
      return;
    }

    if (!isEligibleDesktopPlayback) {
      disconnectSpotifyPlayer();
      dispatch(setConnectionStatus("disconnected"));
      dispatch(setDeviceId(null));
      dispatch(setSdkStatus("unsupported"));
      return;
    }

    let cancelled = false;
    let spotifyPlayer: Spotify.Player | null = null;

    const syncStateFromSdk = (state: Spotify.PlaybackState | null) => {
      if (!state) {
        return;
      }

      const currentTrack = state.track_window.current_track;

      dispatch(
        setPlaybackState({
          currentTrack: currentTrack
            ? {
                spotifyId: currentTrack.id,
                uri: currentTrack.uri,
                title: currentTrack.name,
                artist: currentTrack.artists.map((artist) => artist.name).join(", "),
                album: currentTrack.album.name,
                coverUrl: currentTrack.album.images[0]?.url || "",
                durationMs: currentTrack.duration_ms,
              }
            : null,
          isPlaying: !state.paused,
          positionMs: state.position,
          durationMs: state.duration,
          shuffle: state.shuffle,
          repeatMode: mapRepeatMode(state.repeat_mode),
        }),
      );
    };

    const initPlayer = async () => {
      dispatch(setSdkStatus("loading"));
      dispatch(setConnectionStatus("connecting"));
      dispatch(setPlayerError(null));

      try {
        spotifyPlayer = await initializeSpotifyPlayer();

        if (!spotifyPlayer || cancelled) {
          return;
        }

        const handleReady = async ({ device_id }: Spotify.ReadyPayload) => {
          dispatch(setDeviceId(device_id));
          dispatch(setSdkStatus("ready"));
          dispatch(setConnectionStatus("connected"));

          try {
            const volume = await spotifyPlayer?.getVolume();

            if (typeof volume === "number") {
              dispatch(setVolume(Math.round(volume * 100)));
            }

            const currentState = await spotifyPlayer?.getCurrentState();
            syncStateFromSdk(currentState ?? null);
          } catch {
            // Ignore initial sync failures.
          }
        };

        const handleNotReady = () => {
          dispatch(setConnectionStatus("disconnected"));
          dispatch(setDeviceId(null));
        };

        const handlePlayerStateChanged = (state: Spotify.PlaybackState | null) => {
          syncStateFromSdk(state);
        };

        const handlePlayerError = (error: Spotify.Error) => {
          dispatch(setSdkStatus("error"));
          dispatch(setPlayerError(error.message || "Spotify player error"));
        };

        spotifyPlayer.addListener("ready", handleReady);
        spotifyPlayer.addListener("not_ready", handleNotReady);
        spotifyPlayer.addListener("player_state_changed", handlePlayerStateChanged);
        spotifyPlayer.addListener("initialization_error", handlePlayerError);
        spotifyPlayer.addListener("authentication_error", handlePlayerError);
        spotifyPlayer.addListener("account_error", handlePlayerError);
        spotifyPlayer.addListener("playback_error", handlePlayerError);

        const connected = await spotifyPlayer.connect();

        if (!connected && !cancelled) {
          dispatch(setSdkStatus("error"));
          dispatch(setPlayerError("Unable to connect to the Spotify Web Playback SDK."));
        }

        return () => {
          spotifyPlayer?.removeListener("ready", handleReady);
          spotifyPlayer?.removeListener("not_ready", handleNotReady);
          spotifyPlayer?.removeListener("player_state_changed", handlePlayerStateChanged);
          spotifyPlayer?.removeListener("initialization_error", handlePlayerError);
          spotifyPlayer?.removeListener("authentication_error", handlePlayerError);
          spotifyPlayer?.removeListener("account_error", handlePlayerError);
          spotifyPlayer?.removeListener("playback_error", handlePlayerError);
        };
      } catch (error) {
        if (!cancelled) {
          dispatch(setSdkStatus("error"));
          dispatch(
            setPlayerError(
              error instanceof Error ? error.message : "Failed to initialize Spotify playback.",
            ),
          );
        }
      }

      return undefined;
    };

    let removeListeners: (() => void) | undefined;

    void initPlayer().then((cleanup) => {
      removeListeners = cleanup;
    });

    return () => {
      cancelled = true;
      removeListeners?.();
    };
  }, [
    authUser.isAuthenticated,
    authUser.spotifyConnected,
    authUser.spotifyProduct,
    dispatch,
  ]);

  useEffect(() => {
    if (
      !playerState.pendingPlayback ||
      !playerState.deviceId ||
      playerState.sdkStatus !== "ready" ||
      isMobilePlaybackEnvironment()
    ) {
      return;
    }

    let cancelled = false;

    const runPlayback = async () => {
      try {
        await transferPlaybackToDevice(playerState.deviceId!);
        await startSpotifyPlayback(
          playerState.deviceId!,
          playerState.pendingPlayback!.uris,
        );

        if (!cancelled) {
          dispatch(clearPendingPlayback());
          dispatch(clearMobileFallback());
          dispatch(setPlayerError(null));
        }
      } catch (error) {
        if (!cancelled) {
          dispatch(
            setPlayerError(
              error instanceof Error ? error.message : "Failed to start playback.",
            ),
          );
        }
      }
    };

    void runPlayback();

    return () => {
      cancelled = true;
    };
  }, [
    dispatch,
    playerState.deviceId,
    playerState.pendingPlayback,
    playerState.sdkStatus,
  ]);

  return null;
};

export default SpotifyPlayerBootstrap;
