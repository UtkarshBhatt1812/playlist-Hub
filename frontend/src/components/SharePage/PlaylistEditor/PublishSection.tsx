import React from "react";

const PublishSection: React.FC = () => {
  return (
    <div className="flex justify-between items-center mt-10">

      <div className="flex gap-4">
        <button className="px-5 py-2 rounded-full bg-white/50 backdrop-blur-md">
          Public
        </button>
        <button className="px-5 py-2 rounded-full bg-white/50 backdrop-blur-md">
          Private
        </button>
      </div>

      <button className="
        px-8 py-3
        rounded-full
        bg-gradient-to-r
        from-purple-600
        to-purple-800
        text-white
        shadow-lg
      ">
        Publish Playlist 🚀
      </button>

    </div>
  );
};

export default PublishSection;
