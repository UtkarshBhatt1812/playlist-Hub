import React from "react";
import PlaylistCard from "../../PlaylistCard/PlaylistCard";

const PlaylistGrid: React.FC = () => {

  const playlists = [
    { id: 1, title: "Late Night Lo-Fi", image: "/p1.jpg" },
    { id: 2, title: "Gym Pump 2024", image: "/p2.jpg" },
    { id: 3, title: "Focus Flow", image: "/p3.jpg" },
    { id: 4, title: "Indie Discoveries", image: "/p4.jpg" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
      {playlists.map((p) => (
        <PlaylistCard
          key={p.id}
          title={p.title}
          subtitle="By DJ Jhandu"
          image={p.image}
          likes="1.2k"
          songs={12}
        />
      ))}
    </div>
  );
};

export default PlaylistGrid;
