import React from "react";
import PlaylistActions from "./PlaylistActions";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useParams } from "react-router-dom";
import NotFound from "@/pages/NotFound";

const PlaylistHero: React.FC = () => {

  const playlistId = useParams().id;
  const playlist = useAppSelector(state=>state.playlist.allPlaylist.find(p=>p.id === Number(playlistId)))
  if(!playlist) return <NotFound></NotFound>;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm flex gap-8">


      <img className="w-56 h-56 rounded-2xl shadow-md" src={playlist.image}  />


      <div className="flex flex-col gap-4 flex-1">
        <span className="text-xs rounded-full w-fit">
          SPOTIFY // PLAYLIST
        </span>

        <h1 className="text-4xl font-bold font-headingText text-primaryText">
          {playlist.title}
        </h1>

        <p className="text-secondaryText font-light text-sm font-smtext tracking-wider">
          {playlist.subtitle}
        </p>

        <PlaylistActions />

        <div className="flex gap-3 mt-4">
          {["#Lofi", "#Focus", "#Instrumental", "#Chill"].map(tag => (
            <span key={tag} className="px-3 py-1 bg-neutral-300/40 rounded-full text-primaryText font-light font-smtext text-xs">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlaylistHero;
