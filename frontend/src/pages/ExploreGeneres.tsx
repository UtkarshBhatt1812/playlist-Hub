import React from "react";
import PlaylistCard from "@/components/PlaylistCard/PlaylistCard";

const ExplorePage: React.FC = () => {

  const playlists = [
    {
      id: 1,
      title: "Late Night Lo-Fi",
      subtitle: "By AlexAudio",
      image: "/Hero.png",
      likes: "2.4k",
      songs: 48,
    },
    {
      id: 2,
      title: "Deep Focus Techno",
      subtitle: "By DJ Nova",
      image: "/Hero.png",
      likes: "1.8k",
      songs: 36,
    },
    {
      id: 3,
      title: "Indie Discoveries",
      subtitle: "By SoundWave",
      image: "/Hero.png",
      likes: "3.1k",
      songs: 52,
    },
    {
      id: 4,
      title: "Chill Study Mix",
      subtitle: "By LofiDreamer",
      image: "/Hero.png",
      likes: "5.6k",
      songs: 64,
    },
  ];

  return (
    <div className="
      min-h-screen
      px-8 py-10
      bg-gradient-to-br
      from-[#efe9ff]
      via-[#f6f3ff]
      to-[#e8f6ff]
    ">

      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold text-primaryText">
          Explore Playlists
        </h1>

        <input
          placeholder="Search playlists..."
          className="
            px-5 py-2
            rounded-full
            bg-white/60
            backdrop-blur-md
            border border-white/40
            outline-none
          "
        />
      </div>

      {/* Playlist Grid */}
      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-8
      ">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            title={playlist.title}
            subtitle={playlist.subtitle}
            image={playlist.image}
            likes={playlist.likes}
            songs={playlist.songs}
          />
        ))}
      </div>

    </div>
  );
};

export default ExplorePage;
