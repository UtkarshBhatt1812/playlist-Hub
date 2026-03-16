 import React from "react";
import type { BackendSong } from "@/features/songs/song.types";
import {
  formatSongAddedAt,
  formatSongDuration,
  getSongArtistLabel,
} from "@/lib/songUtils";

interface SavedSongsTableProps {
  songs: BackendSong[];
}

const SavedSongsTable: React.FC<SavedSongsTableProps> = ({ songs }) => {
  if (songs.length === 0) {
    return (
      <div className="rounded-2xl bg-white px-6 py-10 text-center text-secondaryText shadow-sm">
        No saved songs match this view yet.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[30px_1fr_40px] sm:grid-cols-[40px_2fr_1fr_1fr_60px] md:grid-cols-[40px_2fr_1fr_1fr_80px] gap-2 sm:gap-4 text-[10px] sm:text-xs text-secondaryText px-3 sm:px-6 py-3 sm:py-4 border-b">
        <span className="text-center sm:text-left">#</span>
        <span>TITLE</span>
        <span className="hidden sm:block">ALBUM</span>
        <span className="hidden sm:block">DATE ADDED</span>
        <span className="text-right">⏱</span>
      </div>

      {/* Rows */}
      {songs.map((song, index) => (
        <div
          key={song.spotifyId}
          className="grid grid-cols-[30px_1fr_40px] sm:grid-cols-[40px_2fr_1fr_1fr_60px] md:grid-cols-[40px_2fr_1fr_1fr_80px] gap-2 sm:gap-4 px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm items-center hover:bg-neutral-50 transition"
        >
          <span className="text-center sm:text-left text-secondaryText">{index + 1}</span>

          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <div className="h-9 w-9 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-md sm:rounded-lg bg-neutral-100">
              {song.coverImageUrl ? (
                <img
                  src={song.coverImageUrl}
                  alt={song.name}
                  className="h-full w-full object-cover"
                />
              ) : null}
            </div>

            <div className="min-w-0 flex-1">
              <p className="font-medium text-primaryText truncate">{song.name}</p>
              <p className="text-[10px] sm:text-xs text-secondaryText truncate">
                {getSongArtistLabel(song.artists)}
              </p>
            </div>
          </div>

          <span className="hidden sm:block text-secondaryText truncate">
            {song.album || "Single"}
          </span>

          <span className="hidden sm:block text-secondaryText truncate">
            {formatSongAddedAt(song.addedAt)}
          </span>

          <span className="text-right text-secondaryText text-[10px] sm:text-xs whitespace-nowrap">
            {formatSongDuration(song.durationMs)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default SavedSongsTable;
