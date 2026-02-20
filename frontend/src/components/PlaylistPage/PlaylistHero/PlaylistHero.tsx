import React from "react";

import PlaylistAction from "@/components/PlaylistPage/PlaylistHero/PlaylistActions";
import TrackList from "@/components/PlaylistPage/TrackList/TrackList";
import SidebarPanel from "@/components/PlaylistPage/SidebarPanel/SidebarPanel";
// import CommentSection from "@/components/PlaylistPage/CommentSection/CommentSection";

const PlaylistPage: React.FC = () => {
  return (
    <div className="min-h-screen  px-10 py-8">
      <div className="flex gap-8">
        <div className="flex-1 flex flex-col gap-8">
          <PlaylistAction />
          <TrackList />
          {/* <CommentSection /> */}
        </div>
        <SidebarPanel />
      </div>
    </div>
  );
};

export default PlaylistPage;
