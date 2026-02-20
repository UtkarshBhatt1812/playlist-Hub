import React from "react";
import PlaylistActions from "./PlaylistActions";

const PlaylistHero: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm flex gap-8">


      <img className="w-56 h-56 rounded-2xl shadow-md" src="https://img.freepik.com/premium-photo/happy-man-ai-generated-portrait-user-profile_1119669-1.jpg?w=1480"  />


      <div className="flex flex-col gap-4 flex-1">
        <span className="text-xs rounded-full w-fit">
          SPOTIFY
        </span>

        <h1 className="text-4xl font-bold font-headingText text-primaryText">
          Late Night Lo-Fi Beats
        </h1>

        <p className="text-secondaryText font-light text-sm font-smtext tracking-wider">
          The perfect instrumental mix for studying and relaxing.
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
