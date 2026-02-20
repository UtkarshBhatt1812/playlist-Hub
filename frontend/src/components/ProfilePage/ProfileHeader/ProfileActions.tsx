import React from "react";
import { UserPlus, Share2 } from "lucide-react";

const ProfileActions: React.FC = () => {
  return (
    <div className="flex flex-col gap-4">

      <button className="bg-primaryText text-white px-6 py-2 rounded-full flex hover:text-accentText items-center gap-2 hover:scale-105 cursor-pointer transition-transform duration-200">
        <UserPlus size={16} />
        Follow
      </button>

      <button className="border px-6 py-2 rounded-full flex items-center gap-2 hover:text-accentText hover:scale-105 cursor-pointer transition-transform duration-200">
        <Share2 size={16} />
        Share
      </button>

    </div>
  );
};

export default ProfileActions;
