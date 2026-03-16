import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Play, Shuffle, MoreHorizontal, Search } from "lucide-react";
import SavedSongsTable from "@/components/SavedSongs/SavedSongstable";
import api from "@/services/api";
import type { SongLibraryResponse } from "@/features/songs/song.types";
import { subscribeToRefetchEvents } from "@/lib/refetchEvents";
import { formatTotalDuration, sumSongDurations } from "@/lib/songUtils";

const SORT_OPTIONS = ["Recently Added", "Alphabetical"] as const;

const SavedSongsPage: React.FC = () => {
  const [savedSongs, setSavedSongs] = useState<SongLibraryResponse["savedSongs"]>(
    [],
  );
  const [search, setSearch] = useState("");
  const [sortType, setSortType] =
    useState<(typeof SORT_OPTIONS)[number]>("Recently Added");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSavedSongs = useCallback(
    async (silent = false) => {
      try {
        if (!silent) {
          setLoading(true);
        }

        setError(null);
        const response = await api.get<SongLibraryResponse>("/songs/library");
        setSavedSongs(response.data.savedSongs);
      } catch (err) {
        console.error("Failed to fetch saved songs:", err);
        setError("Failed to load saved songs.");
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    void fetchSavedSongs();
  }, [fetchSavedSongs]);

  useEffect(() => {
    return subscribeToRefetchEvents((detail) => {
      if (detail.type === "savedSongs") {
        void fetchSavedSongs(true);
      }
    });
  }, [fetchSavedSongs]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void fetchSavedSongs(true);
    }, 15000);

    const handleFocus = () => {
      void fetchSavedSongs(true);
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchSavedSongs]);

  const filteredSongs = useMemo(() => {
    const normalizedQuery = search.trim().toLowerCase();

    const nextSongs = normalizedQuery
      ? savedSongs.filter((song) => {
          const haystack = [
            song.name,
            song.album,
            ...song.artists,
          ].join(" ").toLowerCase();

          return haystack.includes(normalizedQuery);
        })
      : savedSongs;

    if (sortType === "Alphabetical") {
      return [...nextSongs].sort((left, right) => left.name.localeCompare(right.name));
    }

    return [...nextSongs].sort((left, right) => {
      const leftTime = left.addedAt ? new Date(left.addedAt).getTime() : 0;
      const rightTime = right.addedAt ? new Date(right.addedAt).getTime() : 0;
      return rightTime - leftTime;
    });
  }, [savedSongs, search, sortType]);

  const totalDuration = useMemo(
    () => formatTotalDuration(sumSongDurations(savedSongs)),
    [savedSongs],
  );

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f3f1ff] via-white to-[#eef2ff] px-4 sm:px-10 py-6 sm:py-8 pb-28">
      {/* Hero Section */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 items-center sm:items-start text-center sm:text-left">
        <div className="h-40 w-40 sm:h-64 sm:w-64 shrink-0 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-400 flex items-center justify-center shadow-xl">
          <div className="text-white text-4xl sm:text-6xl">❤</div>
        </div>

        <div className="flex flex-col gap-3 sm:gap-4 items-center sm:items-start mt-2 sm:mt-0">
          <p className="text-[10px] sm:text-xs tracking-widest text-accentText font-medium">
            PLAYLIST
          </p>

          <h1 className="text-3xl sm:text-5xl font-bold text-primaryText">
            Saved Songs
          </h1>

          <p className="text-sm sm:text-base text-secondaryText">
            <span className="text-accentText font-semibold">
              {savedSongs.length} songs
            </span>
            {" · "}
            {totalDuration}
          </p>

          <div className="flex flex-wrap justify-center sm:justify-start gap-3 sm:gap-4 mt-2 sm:mt-4">
            <button className="px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base rounded-full bg-gradient-to-r from-accentText to-purple-600 text-white flex items-center gap-2 shadow-lg hover:scale-105 transition">
              <Play size={16} />
              Play
            </button>

            <button className="px-5 py-2.5 sm:px-6 sm:py-3 text-sm sm:text-base rounded-full bg-neutral-100 text-primaryText flex items-center gap-2 hover:bg-neutral-200 transition">
              <Shuffle size={16} />
              Shuffle
            </button>

            <button className="p-2.5 sm:p-3 rounded-full bg-neutral-100 hover:bg-neutral-200 transition flex items-center justify-center">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-8 sm:mt-12 bg-white/60 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-sm gap-4">
        <div className="flex items-center gap-3 text-secondaryText w-full sm:w-1/2 bg-white sm:bg-transparent p-2 sm:p-0 rounded-xl sm:rounded-none">
          <Search size={18} className="shrink-0" />
          <input
            placeholder="Search in saved tracks..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs sm:text-sm text-secondaryText w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
          <span className="shrink-0 hidden sm:inline">Sort by:</span>
          <div className="flex gap-2 w-full sm:w-auto">
            {SORT_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setSortType(option)}
                className={`rounded-full px-3 py-1.5 sm:py-1 transition whitespace-nowrap flex-1 sm:flex-none text-center ${
                  sortType === option
                    ? "bg-accentText text-white"
                    : "bg-white text-secondaryText"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="rounded-2xl bg-white px-6 py-10 text-center text-secondaryText shadow-sm">
            Loading saved songs...
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-white px-6 py-10 text-center text-red-500 shadow-sm">
            {error}
          </div>
        ) : (
          <SavedSongsTable songs={filteredSongs} />
        )}
      </div>

      <div className="flex-grow" />
    </div>
  );
};

export default SavedSongsPage;
