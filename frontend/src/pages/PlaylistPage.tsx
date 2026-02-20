import React from "react";

import PlaylistHero from "@/components/PlaylistPage/PlaylistHero/Playlistcover";
import TrackList from "@/components/PlaylistPage/TrackList/TrackList";
import SidebarPanel from "@/components/PlaylistPage/SidebarPanel/SidebarPanel";
// import CommentSection from "@/components/PlaylistPage/CommentSection/CommentSection";

const PlaylistPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br
      from-[#efe9ff]
      via-[#f6f3ff]
      to-[#e8f6ff] px-10 py-8">
      <div className="flex gap-8">


        <div className="flex-1 flex flex-col gap-8">
          <PlaylistHero />
          <TrackList />
          {/* <CommunitySection /> */}
        </div>


        <SidebarPanel />
      </div>
    </div>
  );
};

export default PlaylistPage;
