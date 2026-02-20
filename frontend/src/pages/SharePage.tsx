import React from "react";
import ShareHero from "@/components/SharePage/ShareHero";
import PlaylistEditor from "@/components/SharePage/PlaylistEditor/PlaylistEditor";

const SharePage: React.FC = () => {
  return (
    <div className="
      min-h-screen
      bg-gradient-to-br
      from-[#efe9ff]
      via-[#f6f3ff]
      to-[#e8f6ff]
      px-6 py-10
      flex flex-col items-center
    ">
      <ShareHero />
      <PlaylistEditor />
    </div>
  );
};

export default SharePage;
