import React from "react";
import PlaylistActions from "./PlaylistActions";
import NotFound from "@/pages/NotFound";
import type { BackendPlaylist } from "@/features/playlist/playlist.types";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useSpotifyPlayback } from "@/hooks/useSpotifyPlayback";

const PlaylistHero: React.FC<{ playlist: BackendPlaylist | null }> = ({ playlist }) => {
  const userId = useAppSelector((state) => state.auth.user.id);
  const { requestPlayback } = useSpotifyPlayback();

  if (!playlist) return <NotFound />;
  const isLiked = playlist.likes.some((id) => id?.toString() == userId);
  const playableSongs = playlist.songs.filter((song) => song.spotifyId);
  const canPlay = playableSongs.length > 0;

  const handlePlay = () => {
    if (!canPlay) {
      return;
    }

    const firstSong = playableSongs[0];

    void requestPlayback({
      uris: playableSongs.map((song) => `spotify:track:${song.spotifyId}`),
      fallbackUrl:
        firstSong.spotifyUrl ||
        `https://open.spotify.com/track/${firstSong.spotifyId}`,
      meta: {
        title: playlist.name,
        subtitle: playlist.description || `${playableSongs.length} tracks`,
        imageUrl:
          playlist.coverImage ||
          firstSong.coverImageUrl ||
          "https://via.placeholder.com/300?text=No+Cover",
      },
    });
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm flex gap-8">

      <img
        className="w-56 h-56 rounded-2xl shadow-md"
        src={playlist.coverImage || "https://via.placeholder.com/300?text=No+Cover"}
        alt={playlist.name}
      />

      <div className="flex flex-col gap-4 flex-1">

        <h1 className="text-4xl font-bold font-headingText text-primaryText">
          {playlist.name}
        </h1>

        <p className="text-secondaryText font-light text-sm font-smtext tracking-wider">
          {playlist.description}
        </p>

        <PlaylistActions prevLiked={isLiked} onPlay={handlePlay} canPlay={canPlay} />

        <div className="flex gap-3 mt-4">
          {playlist.tags?.map(tag => (
            <span
              key={tag}
              className="px-3 py-1 bg-neutral-300/40 rounded-full text-primaryText font-light font-smtext text-xs"
            >
              {tag}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PlaylistHero;
