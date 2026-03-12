import React, { useEffect, useState } from "react";
import PlaylistHero from "@/components/PlaylistPage/PlaylistHero/Playlistcover";
import TrackList from "@/components/PlaylistPage/TrackList/TrackList";
import SidebarPanel from "@/components/PlaylistPage/SidebarPanel/SidebarPanel";
import api from "@/services/api";
import { useParams } from "react-router-dom";
import type { BackendPlaylist } from "@/features/playlist/playlist.types";

const getPlaylistById = async (id: string) => {
  try {
    const response = await api.get(`/playlists/${id}`);
    return response.data as BackendPlaylist;
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return null;
  }
};

const PlaylistPage: React.FC = () => {
  const { id: playlistId } = useParams();
  const [playlist, setPlaylist] = useState<BackendPlaylist | null>(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      if (!playlistId) return;

      const data = await getPlaylistById(playlistId);
      setPlaylist(data);
    };

    fetchPlaylist();
  }, [playlistId]);

  console.log("Playlist:", playlist);

  return (
    <div className="min-h-screen bg-gradient-to-br
      from-[#efe9ff]
      via-[#f6f3ff]
      to-[#e8f6ff] px-10 py-8">
      <div className="flex gap-8">

        <div className="flex-1 flex flex-col gap-8">
          <PlaylistHero playlist={playlist} />
          <TrackList />
        </div>

        <SidebarPanel />
      </div>
    </div>
  );
};

export default PlaylistPage;