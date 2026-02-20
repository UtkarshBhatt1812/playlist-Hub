import React from "react";
import { Play, Heart, Download } from "lucide-react";

const PlaylistActions: React.FC = () => {
  return (
    <div className="flex gap-4 items-center">
      <button className="bg-primaryText hover:scale-105 cursor-pointer transition-transform duration-300 text-white px-6 py-3 rounded-full flex items-center gap-2">
        <Play size={16} /> Play
      </button>

      <button className="p-3 rounded-full hover:scale-105 cursor-pointer transition-transform duration-300 bg-neutral-200 text-neutral-600 hover:text-red-500">
        <Heart size={16}  />
      </button>

      <button className="p-3 rounded-full hover:scale-105 cursor-pointer transition-transform duration-300 bg-neutral-200 hover:text-accentText text-neutral-600">
        <Download size={16} />
      </button>
    </div>
  );
};

export default PlaylistActions;
