import React, { useCallback, useEffect, useState } from "react";
import PlaylistHero from "@/components/PlaylistPage/PlaylistHero/Playlistcover";
import TrackList from "@/components/PlaylistPage/TrackList/TrackList";
import SidebarPanel from "@/components/PlaylistPage/SidebarPanel/SidebarPanel";
import api from "@/services/api";
import { useParams } from "react-router-dom";
import type { BackendPlaylist } from "@/features/playlist/playlist.types";
import { subscribeToRefetchEvents } from "@/lib/refetchEvents";

const PlaylistPage: React.FC = () => {
  const { id: playlistId } = useParams();
  const [playlist, setPlaylist] = useState<BackendPlaylist | null>(null);

  const fetchPlaylist = useCallback(async () => {
    if (!playlistId) {
      setPlaylist(null);
      return;
    }

    try {
      const response = await api.get(`/playlists/${playlistId}`);
      setPlaylist(response.data as BackendPlaylist);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      setPlaylist(null);
    }
  }, [playlistId]);

  useEffect(() => {
    void fetchPlaylist();
  }, [fetchPlaylist]);

  useEffect(() => {
    return subscribeToRefetchEvents((detail) => {
      if (detail.type === "playlistById" && detail.playlistId === playlistId) {
        void fetchPlaylist();
      }
    });
  }, [fetchPlaylist, playlistId]);

  return (
    <div className="min-h-screen bg-gradient-to-br
      from-[#efe9ff]
      via-[#f6f3ff]
      to-[#e8f6ff] px-4 sm:px-10 py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">

        <div className="flex-1 flex flex-col gap-6 sm:gap-8 min-w-0">
          <PlaylistHero playlist={playlist} />
          <TrackList playlist={playlist} />
        </div>
        {playlist?.owner && <SidebarPanel owner={playlist.owner} />}

      </div>
    </div>
  );
};

export default PlaylistPage;
