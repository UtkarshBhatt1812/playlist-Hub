import React, { useEffect, useState } from "react";
import {
  ExternalLink,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Volume2,
  Music4,
  LoaderCircle,
  Link2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatSongDuration } from "@/lib/songUtils";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useSpotifyPlayback } from "@/hooks/useSpotifyPlayback";
import { isMobilePlaybackEnvironment } from "@/services/spotifyPlayer";

const Miniplayer: React.FC = () => {
  const navigate = useNavigate();
  const authUser = useAppSelector((state) => state.auth.user);
  const player = useAppSelector((state) => state.player);
  const {
    openMobileFallback,
    playNext,
    playPrevious,
    seekTo,
    startSpotifyLinking,
    togglePlayPause,
    updateVolume,
  } = useSpotifyPlayback();
  const [displayPosition, setDisplayPosition] = useState(player.positionMs);

  useEffect(() => {
    setDisplayPosition(player.positionMs);
  }, [player.positionMs, player.currentTrack?.spotifyId]);

  useEffect(() => {
    if (!player.isPlaying || player.durationMs <= 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setDisplayPosition((currentPosition) =>
        Math.min(currentPosition + 1000, player.durationMs),
      );
    }, 1000);

    return () => window.clearInterval(interval);
  }, [player.durationMs, player.isPlaying]);

  const isMobile = isMobilePlaybackEnvironment();
  const isDesktopPremiumReady =
    authUser.isAuthenticated &&
    authUser.spotifyConnected &&
    authUser.spotifyProduct.toLowerCase() === "premium" &&
    !isMobile;
  const hasActiveTrack = Boolean(player.currentTrack);
  const progressPercent = player.durationMs
    ? Math.min((displayPosition / player.durationMs) * 100, 100)
    : 0;
  const displayTitle =
    player.currentTrack?.title || player.mobileFallbackMeta?.title || "Spotify Playback";
  const displaySubtitle =
    player.currentTrack?.artist ||
    player.mobileFallbackMeta?.subtitle ||
    (isMobile
      ? "Playback opens in Spotify on mobile."
      : "Start a track from a playlist page.");
  const displayCover =
    player.currentTrack?.coverUrl || player.mobileFallbackMeta?.imageUrl || "";

  const handleBarClick =
    (
      callback: (ratio: number) => void,
      disabled = false,
    ): React.MouseEventHandler<HTMLDivElement> =>
    (event) => {
      if (disabled) {
        return;
      }

      const bounds = event.currentTarget.getBoundingClientRect();
      const ratio = Math.min(
        Math.max((event.clientX - bounds.left) / bounds.width, 0),
        1,
      );

      callback(ratio);
    };

  if (!authUser.isAuthenticated) {
    return (
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="pointer-events-auto flex w-full max-w-[920px] items-center justify-between gap-4 rounded-2xl border border-white/40 bg-white/55 px-5 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-100">
              <Music4 className="text-secondaryText" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-primaryText">
                Sign in to use Spotify playback
              </p>
              <p className="text-xs text-secondaryText">
                The mini player uses your linked Spotify account.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="rounded-full bg-primaryText px-5 py-2 text-sm font-medium text-white transition hover:scale-105"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  if (!authUser.spotifyConnected) {
    return (
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="pointer-events-auto flex w-full max-w-[920px] items-center justify-between gap-4 rounded-2xl border border-white/40 bg-white/55 px-5 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1DB954]/10">
              <Link2 className="text-[#1DB954]" size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold text-primaryText">
                Connect Spotify to enable playback
              </p>
              <p className="text-xs text-secondaryText">
                Link your Spotify account to play tracks inside PlaylistHub.
              </p>
            </div>
          </div>
          <button
            type="button"
            
            onClick={() => startSpotifyLinking()}
            className="rounded-full bg-[#1DB954] px-5 py-2 text-sm font-medium text-white transition hover:scale-105"
          >
            Connect Spotify
          </button>
        </div>
      </div>
    );
  }

  if (!isMobile && authUser.spotifyProduct.toLowerCase() !== "premium") {
    return (
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="pointer-events-auto flex w-full max-w-[920px] items-center justify-between gap-4 rounded-2xl border border-white/40 bg-white/55 px-5 py-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl">
          <div>
            <p className="text-sm font-semibold text-primaryText">
              Spotify Premium required for browser playback
            </p>
            <p className="text-xs text-secondaryText">
              Your linked account is {authUser.spotifyProduct || "not Premium"}.
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.open("https://www.spotify.com/premium/", "_blank")}
            className="rounded-full border border-[#1DB954] px-5 py-2 text-sm font-medium text-[#1DB954] transition hover:bg-[#1DB954] hover:text-white"
          >
            Upgrade Spotify
          </button>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4 sm:px-6 sm:pb-6">
        <div className="pointer-events-auto flex w-full max-w-[920px] items-center gap-4 rounded-2xl border border-white/40 bg-white/60 px-4 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100">
            {displayCover ? (
              <img
                src={displayCover}
                alt={displayTitle}
                className="h-full w-full object-cover"
              />
            ) : (
              <Music4 className="text-secondaryText" size={20} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-primaryText">
              {displayTitle}
            </p>
            <p className="truncate text-xs text-secondaryText">{displaySubtitle}</p>
          </div>
          <button
            type="button"
            onClick={openMobileFallback}
            disabled={!player.mobileFallbackUrl}
            className="rounded-full bg-[#1DB954] px-4 py-2 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            Open in Spotify
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-50 flex justify-center px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="pointer-events-auto flex w-full max-w-[1200px] items-center justify-between gap-4 rounded-2xl border border-white/40 bg-white/45 p-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl">
        <div className="flex min-w-[220px] w-[30%] items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-neutral-100 shadow-sm">
            {displayCover ? (
              <img
                src={displayCover}
                alt={displayTitle}
                className="h-full w-full object-cover"
              />
            ) : (
              <Music4 className="text-secondaryText" size={20} />
            )}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-primaryText">
              {displayTitle}
            </h4>
            <p className="truncate text-[11px] text-secondaryText">
              {displaySubtitle}
            </p>
            {player.error ? (
              <p className="truncate text-[11px] text-red-500">{player.error}</p>
            ) : null}
          </div>
        </div>

        <div className="flex w-[40%] max-w-[520px] flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => void playPrevious()}
              disabled={!hasActiveTrack || player.sdkStatus !== "ready"}
              className="text-primaryText transition hover:text-accentText disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SkipBack size={20} className="fill-current" />
            </button>
            <button
              type="button"
              onClick={() => void togglePlayPause()}
              disabled={!hasActiveTrack || player.sdkStatus === "loading"}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-accentText text-white shadow-md shadow-accentText/30 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:bg-neutral-300"
            >
              {player.sdkStatus === "loading" ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : player.isPlaying ? (
                <Pause size={18} className="fill-current" />
              ) : (
                <Play size={18} className="ml-0.5 fill-current" />
              )}
            </button>
            <button
              type="button"
              onClick={() => void playNext()}
              disabled={!hasActiveTrack || player.sdkStatus !== "ready"}
              className="text-primaryText transition hover:text-accentText disabled:cursor-not-allowed disabled:opacity-40"
            >
              <SkipForward size={20} className="fill-current" />
            </button>
          </div>

          <div className="flex w-full items-center gap-2 text-[10px] font-medium text-secondaryText">
            <span className="w-10 text-right">
              {formatSongDuration(displayPosition)}
            </span>
            <div
              className="relative flex h-2.5 flex-1 cursor-pointer items-center"
              onClick={handleBarClick(
                (ratio) => void seekTo(Math.round(player.durationMs * ratio)),
                !hasActiveTrack || !isDesktopPremiumReady,
              )}
            >
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200/80">
                <div
                  className="h-full rounded-full bg-accentText"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
            <span className="w-10">{formatSongDuration(player.durationMs)}</span>
          </div>
        </div>

        <div className="hidden min-w-[220px] w-[30%] items-center justify-end gap-3 md:flex">
          <div className="flex items-center gap-2 w-28">
            <button
              type="button"
              className="text-secondaryText transition hover:text-accentText"
            >
              <Volume2 size={16} />
            </button>
            <div
              className="flex h-2.5 flex-1 cursor-pointer items-center"
              onClick={handleBarClick(
                (ratio) => void updateVolume(Math.round(ratio * 100)),
                !isDesktopPremiumReady,
              )}
            >
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-200/80">
                <div
                  className="h-full rounded-full bg-accentText/80"
                  style={{ width: `${player.volume}%` }}
                />
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={openMobileFallback}
            disabled={!player.mobileFallbackUrl}
            className="text-secondaryText transition hover:text-accentText disabled:cursor-not-allowed disabled:opacity-40"
            title="Open current track in Spotify"
          >
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Miniplayer;
