import React, { useEffect } from "react";
import PlaylistHero from "@/components/PlaylistPage/PlaylistHero/Playlistcover";
import TrackList from "@/components/PlaylistPage/TrackList/TrackList";
import SidebarPanel from "@/components/PlaylistPage/SidebarPanel/SidebarPanel";
import api from "@/services/api";
import { useParams } from "react-router-dom";
import { type SpotifyPlaylist } from "@/components/PlaylistPage/playlist.types";
import type { BackendPlaylist } from "@/features/playlist/playlist.types";
// import CommentSection from "@/components/PlaylistPage/CommentSection/CommentSection";
const getPlaylistById = async (id : string) => {
  try {
    const response = await api.get(`/playlists/${id}`);
    return response.data
  } catch (error) 
  {
    console.error("Error fetching playlist:", error);
    return null;

  }
};
const PlaylistPage: React.FC =  () => {
  const playlistId = useParams().id;
  const [playlist, setPlaylist] = React.useState<BackendPlaylist | null>(null);
 
  const fetchPlaylist = async () => {
    if (playlistId) {
      const data = await getPlaylistById(playlistId);
      return data ; 
    }
  }
  



useEffect(() => {
  const loadPlaylist = async () => {
    const data = await fetchPlaylist();
    setPlaylist(data);
  };
  loadPlaylist();
}, [playlistId]);

  return (
    <div className="min-h-screen bg-gradient-to-br
      from-[#efe9ff]
      via-[#f6f3ff]
      to-[#e8f6ff] px-10 py-8">
      <div className="flex gap-8">


        <div className="flex-1 flex flex-col gap-8">
          <PlaylistHero  playlist={playlist}  />
          <TrackList />
          {/* <CommunitySection /> */}
        </div>


        <SidebarPanel />
      </div>
    </div>
  );
};

export default PlaylistPage;
