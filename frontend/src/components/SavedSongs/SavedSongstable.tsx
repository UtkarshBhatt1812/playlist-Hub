 import React from "react";

const songs = [
  {
    id: 1,
    title: "Neon Nights",
    artist: "Stellar Drift",
    album: "Cyber City Memories",
    date: "Oct 12, 2023",
    duration: "3:45",
  },
  {
    id: 2,
    title: "Midnight Waves",
    artist: "The Dreamers",
    album: "Lofi Horizons",
    date: "Oct 10, 2023",
    duration: "4:12",
  },
  {
    id: 3,
    title: "Morning Mist",
    artist: "Ambient Flow",
    album: "Quiet Spaces",
    date: "Oct 08, 2023",
    duration: "5:28",
  },
];

const SavedSongsTable: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">


      <div className="grid grid-cols-6 text-xs text-secondaryText px-6 py-4 border-b">
        <span>#</span>
        <span className="col-span-2">TITLE</span>
        <span>ALBUM</span>
        <span>DATE ADDED</span>
        <span className="text-right">⏱</span>
      </div>


      {songs.map((song, index) => (
        <div
          key={song.id}
          className="grid grid-cols-6 px-6 py-4 text-sm items-center hover:bg-neutral-50 transition"
        >
          <span>{index + 1}</span>

          <div className="col-span-2">
            <p className="font-medium text-primaryText">{song.title}</p>
            <p className="text-xs text-secondaryText">
              {song.artist}
            </p>
          </div>

          <span className="text-secondaryText">
            {song.album}
          </span>

          <span className="text-secondaryText">
            {song.date}
          </span>

          <span className="text-right text-secondaryText">
            {song.duration}
          </span>
        </div>
      ))}

      <div className="text-center py-6 text-accentText font-medium cursor-pointer hover:underline">
        Show more songs
      </div>

    </div>
  );
};

export default SavedSongsTable;
