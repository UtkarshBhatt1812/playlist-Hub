import React from "react";
import TrackRow from "./TrackRow";

const dummyTracks = [
  { id: 1, title: "Midnight Coffee", artist: "LoFi Dreamer", album: "Cafe Vibes", duration: "2:45" },
  { id: 2, title: "Rainy Window Pane", artist: "ChillHop Master", album: "Stormy Days", duration: "3:12" },
];

const TrackList: React.FC = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tracks</h2>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {dummyTracks.map(track => (
          <TrackRow key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
};

export default TrackList;
