import React from "react";

const ProfileTabs: React.FC = () => {
  return (
    <div className="flex gap-8 mt-10 border-b border-neutral-200 pb-4 text-neutral-500">
      <button className="text-secondaryText cursor-pointer font-semibold border-b-2 border-transparent hover:border-primaryText pb-2">
        Shared Playlists
      </button>
      <button className="text-secondaryText cursor-pointer font-semibold border-b-2 border-transparent hover:border-primaryText pb-2">
        Saved Favorites
      </button>
     
    </div>
  );
};

export default ProfileTabs;
