import React, { useCallback, useEffect, useMemo, useState } from "react";
import PlaylistCard from "@/components/PlaylistCard/PlaylistCard";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { BackendPlaylist } from "@/features/playlist/playlist.types";
import { subscribeToRefetchEvents } from "@/lib/refetchEvents";

const filters = ["Recently Added", "Alphabetical"];

const SavedPage: React.FC = () => {
  const navigate = useNavigate();

  const userId = useAppSelector((state) => state.auth.user.id);

  const [savedPlaylists, setSavedPlaylists] = useState<BackendPlaylist[]>([]);
  const [activeFilter, setActiveFilter] = useState("Recently Added");

  const fetchSavedPlaylists = useCallback(async () => {
    if (!userId) {
      setSavedPlaylists([]);
      return;
    }

    try {
      const response = await api.get(`/users/${userId}/saved`);
      setSavedPlaylists(response.data.savedPlaylists as BackendPlaylist[]);
    } catch (error) {
      console.error("Error fetching saved playlists:", error);
    }
  }, [userId]);

  useEffect(() => {
    void fetchSavedPlaylists();
  }, [fetchSavedPlaylists]);

  useEffect(() => {
    return subscribeToRefetchEvents((detail) => {
      if (detail.type === "savedPlaylists") {
        void fetchSavedPlaylists();
      }
    });
  }, [fetchSavedPlaylists]);

  const sortedPlaylists = useMemo(() => {
    if (activeFilter === "Alphabetical") {
      return [...savedPlaylists].sort((a, b) => a.name.localeCompare(b.name));
    }

    return savedPlaylists;
  }, [savedPlaylists, activeFilter]);

  const handleSavedChange = (playlistId: string, saved: boolean) => {
    void playlistId;
    void saved;
    void fetchSavedPlaylists();
  };

  return (
    <div className="px-4 py-6 sm:px-10 sm:py-10 flex flex-col gap-6 sm:gap-10 pb-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl sm:text-4xl font-bold text-primaryText">
            Saved Playlists
          </h1>

          <p className="text-xs sm:text-sm text-secondaryText mt-1 sm:mt-2">
            Discover and listen to your curated collection.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`
                px-4 py-2 sm:px-5 sm:py-2 rounded-xl text-[10px] sm:text-sm font-semibold sm:font-medium flex-1 sm:flex-none
                transition-all duration-300
                ${activeFilter === filter
                  ? "bg-gradient-to-r from-accentText to-purple-600 text-white shadow-md"
                  : "bg-neutral-100 text-secondaryText hover:bg-neutral-200"
                }
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-8">
        {sortedPlaylists.map((playlist) => (
          <PlaylistCard
            key={playlist._id}
            playlist={{
              id: playlist._id,
              title: playlist.name,
              subtitle: playlist.description || "Saved Playlist",
              image: playlist.coverImage || "/Hero.png",
              likes: playlist.likes,
              songs: playlist.songs?.length || 0,
              totalLikes: playlist.totalLikes || 0,
              featured: false,
            }}
            onSavedChange={handleSavedChange}
          />
        ))}
      </div>

      <div
        className="
        mt-4 sm:mt-10
        border-2 border-dashed border-accentText/30
        rounded-2xl sm:rounded-3xl
        py-8 sm:py-14
        px-4 sm:px-10
        flex flex-col items-center gap-4 sm:gap-6
        bg-gradient-to-br
        from-white
        to-accentText/5
      "
      >
        <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-full bg-gradient-to-r from-accentText to-purple-600 flex items-center justify-center shadow-lg">
          <Plus className="text-white w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        <h2 className="text-lg sm:text-xl font-bold sm:font-semibold text-primaryText text-center">
          Want to discover more?
        </h2>

        <p className="text-secondaryText text-center max-w-md text-xs sm:text-sm">
          Browse through thousands of community-curated playlists and add them
          to your library.
        </p>

        <button
          onClick={() => navigate("/explore")}
          className="
            px-6 py-2.5 sm:px-8 sm:py-3 rounded-full
            bg-gradient-to-r from-accentText to-purple-600
            text-white font-medium text-xs sm:text-base
            shadow-lg
            hover:scale-105 transition-transform
          "
        >
          Explore New Playlists
        </button>
      </div>
    </div>
  );
};

export default SavedPage;
