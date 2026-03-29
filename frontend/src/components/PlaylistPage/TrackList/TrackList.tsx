import React, { useCallback, useEffect, useState } from "react";
import TrackRow from "./TrackRow";
import { useNavigate, useParams } from "react-router-dom";
import api from "@/services/api";
import { subscribeToRefetchEvents } from "@/lib/refetchEvents";
import type { BackendPlaylist } from "@/features/playlist/playlist.types";
import { useSpotifyPlayback } from "@/hooks/useSpotifyPlayback";
import { useAppSelector } from "@/hooks/useAppSelector";

type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  durationMs: number;
  coverImageUrl: string;
  spotifyUrl: string;
};

const TrackList: React.FC<{ playlist: BackendPlaylist | null }> = ({ playlist }) => {
  const { id } = useParams();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { requestPlayback } = useSpotifyPlayback();
  const currentTrackId = useAppSelector(
    (state) => state.player.currentTrack?.spotifyId,
  );

  const fetchTracks = useCallback(async () => {
    try {
      if (!id) {
        setTracks([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      const res = await api.get(`/playlists/${id}/tracks`);
      setTracks(res.data.tracks as Track[]);
    } catch (err) {
      console.error("Error fetching tracks:", err);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchTracks();
  }, [fetchTracks]);

  useEffect(() => {
    return subscribeToRefetchEvents((detail) => {
      if (detail.type === "playlistById" && detail.playlistId === id) {
        void fetchTracks();
      }
    });
  }, [fetchTracks, id]);

  if (loading) {
    return <div>Loading tracks...</div>;
  }

  const handleTrackPlay = (index: number) => {
    const selectedTrack = tracks[index];

    if (!selectedTrack) {
      return;
    }

    void requestPlayback({
      uris: tracks.slice(index).map((track) => `spotify:track:${track.id}`),
      fallbackUrl:
        selectedTrack.spotifyUrl || `https://open.spotify.com/track/${selectedTrack.id}`,
      meta: {
        title: selectedTrack.title,
        subtitle: playlist?.name || selectedTrack.artist,
        imageUrl:
          selectedTrack.coverImageUrl ||
          playlist?.coverImage ||
          "https://via.placeholder.com/300?text=No+Cover",
      },
    });
  };

  return (
    <div>

      <div className="flex justify-between mx-2.5">
        <h2 className="text-xl font-semibold mb-4">Tracks</h2>
      <button
        className="bg-accentText text-white py-2 px-4 rounded-full hover:bg-purple-600 transition"
        onClick={() => navigate(`/add-songs?playlistId=${id}`)}
      >
        Add Track
      </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

        {tracks.length === 0 ? (
          <div className="px-6 py-10 text-center text-secondaryText">
            No tracks in this playlist yet.
          </div>
        ) : (
        tracks.map((track, index) => (
          <TrackRow
            key={track.id}
            track={track}
            isActive={currentTrackId === track.id}
            onPlay={() => handleTrackPlay(index)}
          />
        ))
        )}

      </div>

    </div>
  );
};

export default TrackList;
