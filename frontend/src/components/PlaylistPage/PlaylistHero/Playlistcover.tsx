import React from "react";
import PlaylistActions from "./PlaylistActions";
import NotFound from "@/pages/NotFound";
import type { BackendPlaylist } from "@/features/playlist/playlist.types";
import { useAppSelector } from "@/hooks/useAppSelector";

const PlaylistHero: React.FC<{ playlist: BackendPlaylist | null }> = ({ playlist }) => {

  const userId = useAppSelector((state) => state.auth.user.id);

  if (!playlist) return <NotFound />;
  // i m returning alreadyLiked  so i will pass opposite
  console.log("frontend fecth : ",playlist)
  console.log("user",userId)
  const isLiked = playlist.likes.some((id) => id?.toString() == userId);
  console.log("prev liked : ",isLiked)

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

        <PlaylistActions  prevLiked = {isLiked} />

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