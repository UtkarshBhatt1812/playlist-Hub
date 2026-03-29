import React from "react";
import { Play } from "lucide-react";
import { formatSongDuration } from "@/lib/songUtils";

interface TrackProps {
  track: {
    id?: string;
    title: string;
    artist: string;
    album: string;
    durationMs: string | number;
  };
  onPlay: () => void;
  isActive: boolean;
}

const TrackRow: React.FC<TrackProps> = ({ track, onPlay, isActive }) => {
  const duration =
    typeof track.durationMs === "number"
      ? formatSongDuration(track.durationMs)
      : track.durationMs;

  return (
    <div
      className={`flex items-center justify-between gap-4 border-b px-6 py-4 last:border-none hover:bg-neutral-50 ${isActive ? "bg-accentText/5" : ""}`}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onPlay}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primaryText text-white transition hover:scale-105"
        >
          <Play size={14} className="ml-0.5 fill-current" />
        </button>
        <div>
          <p className="font-medium">{track.title}</p>
          <p className="text-xs text-neutral-500">
            {track.artist}
            {track.album ? ` • ${track.album}` : ""}
          </p>
        </div>
      </div>

      <span className="text-neutral-500">{duration}</span>
    </div>
  );
};

export default TrackRow;
