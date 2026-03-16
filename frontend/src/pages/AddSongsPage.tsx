import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { AxiosError } from "axios";
import { ArrowLeft, Search } from "lucide-react";
import SearchResultRow from "@/components/AddSongsPage/SearchResultRow";
import PlaylistSelector from "@/components/AddSongsPage/PlaylistSelector";
import api from "@/services/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import type {
  AddSongsTarget,
  SearchTrack,
  SongLibraryResponse,
} from "@/features/songs/song.types";
import { useAppSelector } from "@/hooks/useAppSelector";
import { emitRefetchEvent } from "@/lib/refetchEvents";

type SongMutationResponse = {
  added?: boolean;
  removed?: boolean;
  message?: string;
};

type ApiErrorResponse = {
  message?: string;
  error?: string;
};

const EMPTY_LIBRARY: SongLibraryResponse = {
  savedSongs: [],
  playlists: [],
};

const AddSongsPage: React.FC = () => {
  const userId = useAppSelector((state) => state.auth.user.id);
  const [searchResults, setSearchResults] = useState<SearchTrack[]>([]);
  const [library, setLibrary] = useState<SongLibraryResponse>(EMPTY_LIBRARY);
  const [selectedTarget, setSelectedTarget] = useState<AddSongsTarget>({
    type: "saved",
  });
  const [search, setSearch] = useState("");
  const [searchLoading, setSearchLoading] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [libraryError, setLibraryError] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [addingSongId, setAddingSongId] = useState<string | null>(null);
  const [removingSongId, setRemovingSongId] = useState<string | null>(null);
  const searchRequestIdRef = useRef(0);
  const hasAppliedQueryTarget = useRef(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fetchTracks = useCallback(async (query: string) => {
    const requestId = searchRequestIdRef.current + 1;
    searchRequestIdRef.current = requestId;

    try {
      setSearchLoading(true);
      setSearchError(null);
      const response = await api.get("/songs", {
        params: { search: query || "punjabi" },
      });

      if (searchRequestIdRef.current !== requestId) {
        return;
      }

      setSearchResults(response.data.tracks as SearchTrack[]);
    } catch (error) {
      console.error("Failed to fetch tracks:", error);
      if (searchRequestIdRef.current === requestId) {
        setSearchError("Failed to fetch tracks.");
      }
    } finally {
      if (searchRequestIdRef.current === requestId) {
        setSearchLoading(false);
      }
    }
  }, []);

  const fetchLibrary = useCallback(
    async (silent = false) => {
      if (!userId) {
        setLibrary(EMPTY_LIBRARY);
        setLibraryLoading(false);
        return;
      }

      try {
        if (!silent) {
          setLibraryLoading(true);
        }

        setLibraryError(null);
        const response = await api.get<SongLibraryResponse>("/songs/library");
        setLibrary(response.data);
      } catch (error) {
        console.error("Failed to fetch song library:", error);
        setLibraryError("Failed to load your saved songs and playlists.");
      } finally {
        if (!silent) {
          setLibraryLoading(false);
        }
      }
    },
    [userId],
  );

  useEffect(() => {
    const delay = setTimeout(() => {
      void fetchTracks(search.trim());
    }, 350);

    return () => clearTimeout(delay);
  }, [fetchTracks, search]);

  useEffect(() => {
    void fetchLibrary();
  }, [fetchLibrary]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void fetchLibrary(true);
    }, 15000);

    const handleFocus = () => {
      void fetchLibrary(true);
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchLibrary]);

  useEffect(() => {
    const requestedPlaylistId = searchParams.get("playlistId");

    if (
      !requestedPlaylistId ||
      hasAppliedQueryTarget.current ||
      !library.playlists.some((playlist) => playlist._id === requestedPlaylistId)
    ) {
      return;
    }

    setSelectedTarget({ type: "playlist", playlistId: requestedPlaylistId });
    hasAppliedQueryTarget.current = true;
  }, [library.playlists, searchParams]);

  useEffect(() => {
    if (
      selectedTarget.type === "playlist" &&
      !library.playlists.some((playlist) => playlist._id === selectedTarget.playlistId)
    ) {
      setSelectedTarget({ type: "saved" });
    }
  }, [library.playlists, selectedTarget]);

  const selectedCollection = useMemo(() => {
    if (selectedTarget.type === "saved") {
      return {
        label: "Saved Songs",
        songs: library.savedSongs,
      };
    }

    const playlist = library.playlists.find(
      (item) => item._id === selectedTarget.playlistId,
    );

    if (!playlist) {
      return {
        label: "Saved Songs",
        songs: library.savedSongs,
      };
    }

    return {
      label: playlist.name,
      songs: playlist.songs,
    };
  }, [library.playlists, library.savedSongs, selectedTarget]);

  const selectedSongIds = useMemo(
    () => new Set(selectedCollection.songs.map((song) => song.spotifyId)),
    [selectedCollection.songs],
  );

  const recentlyAdded = useMemo(
    () => selectedCollection.songs.slice(0, 6),
    [selectedCollection.songs],
  );

  const emitLibraryEvents = useCallback((target: AddSongsTarget) => {
    if (target.type === "saved") {
      emitRefetchEvent({ type: "savedSongs" });
      return;
    }

    emitRefetchEvent({ type: "myPlaylists" });
    emitRefetchEvent({
      type: "playlistById",
      playlistId: target.playlistId,
    });
  }, []);

  const handleAddSong = useCallback(
    async (song: SearchTrack) => {
      const target = selectedTarget;

      try {
        setAddingSongId(song.id);
        setFeedbackMessage(null);

        const response = await api.post<SongMutationResponse>("/songs/library", {
          targetType: target.type,
          targetId: target.type === "playlist" ? target.playlistId : undefined,
          song: {
            spotifyId: song.id,
            name: song.name,
            artists: song.artists,
            album: song.album,
            durationMs: song.duration_ms,
            coverImageUrl: song.cover || "",
            spotifyUrl: song.spotify_url,
          },
        });

        setFeedbackMessage(response.data.message || `${song.name} added.`);
        emitLibraryEvents(target);
        await fetchLibrary(true);
      } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        setFeedbackMessage(
          apiError.response?.data?.message ||
          apiError.response?.data?.error ||
          "Failed to add song.",
        );
      } finally {
        setAddingSongId(null);
      }
    },
    [emitLibraryEvents, fetchLibrary, selectedTarget],
  );

  const handleRemoveSong = useCallback(
    async (spotifyId: string) => {
      const target = selectedTarget;

      try {
        setRemovingSongId(spotifyId);
        setFeedbackMessage(null);

        const response = await api.delete<SongMutationResponse>("/songs/library", {
          data: {
            targetType: target.type,
            targetId: target.type === "playlist" ? target.playlistId : undefined,
            spotifyId,
          },
        });

        setFeedbackMessage(response.data.message || "Song removed.");
        emitLibraryEvents(target);
        await fetchLibrary(true);
      } catch (error) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        setFeedbackMessage(
          apiError.response?.data?.message ||
          apiError.response?.data?.error ||
          "Failed to remove song.",
        );
      } finally {
        setRemovingSongId(null);
      }
    },
    [emitLibraryEvents, fetchLibrary, selectedTarget],
  );

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-[#f3f1ff] via-white to-[#eef2ff] px-5 py-8 md:px-10">
      <button
        type="button"
        className="mt-1 flex items-center gap-5 text-left text-3xl font-bold text-primaryText"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft />
        Find Music to Add
      </button>
      <p className="text-secondaryText mt-1 text-sm">
        Build your perfect collection by searching millions of tracks.
      </p>

      {feedbackMessage ? (
        <div className="mt-4 rounded-2xl border border-accentText/20 bg-white/80 px-4 py-3 text-sm text-secondaryText shadow-sm">
          {feedbackMessage}
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-8 xl:flex-row">
        <div className="flex-1">
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md border border-accentText/30 rounded-2xl px-5 py-4 shadow-sm focus-within:border-accentText/60 transition">
            <Search size={18} className="text-secondaryText" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for tracks, artists, or albums..."
              className="bg-transparent outline-none w-full text-sm text-primaryText placeholder:text-secondaryText"
            />
          </div>

          <div className="mt-4 rounded-2xl bg-white/60 px-4 py-3 text-sm text-secondaryText shadow-sm">
            Adding to <span className="font-semibold text-primaryText">{selectedCollection.label}</span>
            {libraryLoading ? " • syncing library..." : ""}
          </div>

          {libraryError ? (
            <div className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-500">
              {libraryError}
            </div>
          ) : null}

          <div className="mt-6 px-2">
            {searchLoading ? (
              <p className="text-secondaryText text-sm text-center mt-10">
                Loading...
              </p>
            ) : searchError ? (
              <p className="text-red-500 text-sm text-center mt-10">
                {searchError}
              </p>
            ) : searchResults.length === 0 ? (
              <p className="text-secondaryText text-sm text-center mt-10">
                No tracks found.
              </p>
            ) : (
              searchResults.map((song) => (
                <SearchResultRow
                  key={song.id}
                  song={song}
                  onAdd={handleAddSong}
                  isAdded={selectedSongIds.has(song.id)}
                  isAdding={addingSongId === song.id}
                  destinationLabel={selectedCollection.label}
                />
              ))
            )}
          </div>
        </div>
        <PlaylistSelector
          playlists={library.playlists}
          savedSongs={library.savedSongs}
          selectedTarget={selectedTarget}
          onSelectTarget={setSelectedTarget}
          recentlyAdded={recentlyAdded}
          onRemoveSong={handleRemoveSong}
          isRemovingSongId={removingSongId}
        />
      </div>
    </div>
  );
};

export default AddSongsPage;
