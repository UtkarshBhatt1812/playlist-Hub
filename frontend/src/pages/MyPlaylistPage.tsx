import React, { useEffect, useMemo, useState } from "react";
import { Plus, Grid2X2, List } from "lucide-react";
import PlaylistCard from "@/components/PlaylistCard/PlaylistCard";
import { useAppSelector } from "@/hooks/useAppSelector";
import { addPlaylist } from "@/features/playlist/playlistSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";

type SortType = "recent" | "alphabetical";

const MyPlaylistsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const myPlaylists = useAppSelector(
    (state) => state.playlist.myPlaylist || []
  );

  const [sortType, setSortType] = useState<SortType>("recent");
  const [gridView, setGridView] = useState(true);


  const sortedPlaylists = useMemo(() => {
    if (sortType === "alphabetical") {
      return [...myPlaylists].sort((a, b) =>
        a.title.localeCompare(b.title)
      );
    }
    return myPlaylists;
  }, [myPlaylists, sortType]);



  const handleCreatePlaylist = () => {
    const newPlaylist = {
      id: Date.now(),
      title: "New Playlist",
      subtitle: "by You",
      image: "/Hero.png",
      likes: "0",
      songs: 0,
      featured: false,
    };


    dispatch(addPlaylist(newPlaylist));

  };
  useEffect(() => {
  console.log("Updated myPlaylists:", myPlaylists);
}, [myPlaylists]);
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f7f3ff] via-white to-[#eef2ff] px-10 py-8">


      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs tracking-widest text-secondaryText">
            MY LIBRARY • PLAYLISTS
          </p>

          <h1 className="text-4xl font-bold text-primaryText mt-2">
            My Playlists
          </h1>

          <p className="text-secondaryText mt-2 max-w-md">
            Organize your favorite tracks into custom collections
            and share them with the world.
          </p>
        </div>

        <button
          onClick={handleCreatePlaylist}
          className="bg-gradient-to-r from-accentText to-purple-600 text-white px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:scale-105 transition"
        >
          <Plus size={16} />
          Create New Playlist
        </button>
      </div>


      <div className="flex justify-between items-center mt-10">
        <div className="flex items-center gap-4">


          <button
            onClick={() =>
              setSortType((prev) =>
                prev === "recent" ? "alphabetical" : "recent"
              )
            }
            className="bg-neutral-100 px-4 py-2 rounded-lg text-sm text-secondaryText hover:bg-neutral-200 transition"
          >
            Sort: {sortType === "recent" ? "Recently Added" : "Alphabetical"}
          </button>


          <div className="flex gap-2">
            <button
              onClick={() => setGridView(true)}
              className={`p-2 rounded-lg ${
                gridView ? "bg-accentText text-white" : "bg-neutral-100"
              }`}
            >
              <Grid2X2 size={16} />
            </button>

            <button
              onClick={() => setGridView(false)}
              className={`p-2 rounded-lg ${
                !gridView ? "bg-accentText text-white" : "bg-neutral-100"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        <span className="text-sm text-secondaryText">
          {sortedPlaylists.length} PLAYLISTS
        </span>
      </div>


      <div
        className={`mt-10 ${
          gridView
            ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8"
            : "flex flex-col gap-6"
        }`}
      >
        {sortedPlaylists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            className={!gridView ? "flex flex-row items-center gap-6" : ""}
          />
        ))}


        {gridView && (
          <div
            onClick={handleCreatePlaylist}
            className="border-2 border-dashed border-accentText/30 rounded-2xl flex flex-col items-center justify-center py-16 hover:bg-accentText/5 transition cursor-pointer"
          >
            <div className="h-12 w-12 rounded-full bg-accentText/10 flex items-center justify-center mb-4">
              <Plus className="text-accentText" />
            </div>
            <p className="text-secondaryText text-sm font-medium">
              Create Playlist
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPlaylistsPage;
