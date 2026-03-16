import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Grid2X2, List } from "lucide-react";
import PlaylistCard from "@/components/PlaylistCard/PlaylistCard";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useNavigate } from "react-router";
import api from "@/services/api";
import type { BackendPlaylist } from "@/features/playlist/playlist.types";
import { subscribeToRefetchEvents } from "@/lib/refetchEvents";

type SortType = "recent" | "alphabetical";

const MyPlaylistsPage: React.FC = () => {
  const navigate = useNavigate();
  const userId = useAppSelector((state) => state.auth.user?.id);
  const [myPlaylists, setMyPlaylists] = useState<BackendPlaylist[]>([]);

  const fetchMyPlaylists = useCallback(async () => {
    if (!userId) {
      setMyPlaylists([]);
      return;
    }

    try {
      const response = await api.get(`/users/${userId}/myPlaylists`);
      setMyPlaylists(response.data as BackendPlaylist[]);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  }, [userId]);

  useEffect(() => {
  fetchMyPlaylists();
  }, [fetchMyPlaylists]);

  useEffect(() => {
    return subscribeToRefetchEvents((detail) => {
      if (detail.type === "myPlaylists") {
        void fetchMyPlaylists();
      }
    });
  }, [fetchMyPlaylists]);
  
  const [sortType, setSortType] = useState<SortType>("recent");
  const [gridView, setGridView] = useState(true);


  const sortedPlaylists = useMemo(() => {
    if (sortType === "alphabetical") {
      return [...myPlaylists].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }
    return myPlaylists;
  }, [myPlaylists, sortType]);


  const handleCreatePlaylist = () => {
    navigate('/create')
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f7f3ff] via-white to-[#eef2ff] px-4 sm:px-10 py-6 sm:py-8 pb-24">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <p className="text-[10px] sm:text-xs tracking-widest text-secondaryText">
            MY LIBRARY • PLAYLISTS
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-primaryText mt-1 sm:mt-2">
            My Playlists
          </h1>

          <p className="text-xs sm:text-sm text-secondaryText mt-1 sm:mt-2 max-w-md">
            Organize your favorite tracks into custom collections
            and share them with the world.
          </p>
        </div>

        <button
          onClick={handleCreatePlaylist}
          className="bg-gradient-to-r from-accentText to-purple-600 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-full flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition w-full sm:w-auto text-sm sm:text-base"
        >
          <Plus size={16} />
          Create New Playlist
        </button>
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center mt-6 sm:mt-10 gap-4 sm:gap-0">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">

          <button
            onClick={() =>
              setSortType((prev) =>
                prev === "recent" ? "alphabetical" : "recent"
              )
            }
            className="bg-neutral-100/80 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm text-secondaryText hover:bg-neutral-200 transition whitespace-nowrap"
          >
            Sort: {sortType === "recent" ? "Recently Added" : "Alphabetical"}
          </button>

          <div className="flex gap-1 sm:gap-2">
            <button
              onClick={() => setGridView(true)}
              className={`p-1.5 sm:p-2 rounded-lg transition ${
                gridView ? "bg-accentText text-white" : "bg-neutral-100/80 hover:bg-neutral-200"
              }`}
            >
              <Grid2X2 size={16} />
            </button>

            <button
              onClick={() => setGridView(false)}
              className={`p-1.5 sm:p-2 rounded-lg transition ${
                !gridView ? "bg-accentText text-white" : "bg-neutral-100/80 hover:bg-neutral-200"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <span className="text-xs sm:text-sm text-secondaryText font-medium self-end sm:self-auto">
          {sortedPlaylists.length} PLAYLISTS
        </span>
      </div>

      <div
        className={`mt-6 sm:mt-10 pb-10 ${
          gridView
            ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8"
            : "flex flex-col gap-4 sm:gap-6"
        }`}
      >
        {sortedPlaylists.map((playlist) => (
          <PlaylistCard
            key={playlist._id}
            playlist={{
              id: playlist._id,
              title: playlist.name,
              subtitle: playlist.description || "No description",
              image: playlist.coverImage || "/default-playlist.jpg",
              likes: playlist.likes,
              songs: playlist.songs?.length || 0,
              totalLikes: playlist.totalLikes || 0,
              featured: false,
            }}
            className={!gridView ? "flex flex-row items-center gap-4 sm:gap-6" : ""}
          />
        ))}

        {gridView && (
          <div
            onClick={handleCreatePlaylist}
            className="border-2 border-dashed border-accentText/30 rounded-2xl flex flex-col items-center justify-center py-10 sm:py-16 hover:bg-accentText/5 transition cursor-pointer"
          >
            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-accentText/10 flex items-center justify-center mb-3 sm:mb-4">
              <Plus className="text-accentText shrink-0" size={20} />
            </div>
            <p className="text-secondaryText text-[10px] sm:text-sm font-medium">
              Create Playlist
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPlaylistsPage;
