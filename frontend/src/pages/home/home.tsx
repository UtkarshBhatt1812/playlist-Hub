import React from "react";
import Filterdiv from "@/components/Filters/Filterdiv";
import Hero from "@/components/Hero/Hero";
import NavBar from "@/components/Navbar/navBar";
import Sidebar from "@/components/Sidebar/Sidebar";
import PlaylistCard from "@/components/PlaylistCard/PlaylistCard";

const Home: React.FC = () => {
  const playlists = [
    {
      id: 1,
      title: "Late Night Lo-Fi",
      subtitle: "By PlaylistHub Curators",
      image: "/Hero.png",
      likes: "2.4k",
      songs: 48,
      featured: true,
    },
    {
      id: 2,
      title: "Chill Indie Mix",
      subtitle: "By Emily",
      image: "/Hero.png",
      likes: "1.8k",
      songs: 36,
    },
    {
      id: 3,
      title: "Synthwave Drive",
      subtitle: "By Retro Lovers",
      image: "/Hero.png",
      likes: "3.1k",
      songs: 52,
    },
  ];

  return (
    <div
      className="
        min-h-screen
        flex
        bg-gradient-to-br
        from-[#ebdefe] from-10%
        via-[#cfd7ff]/80 via-45%
        to-[#f4ffff]
      "
    >
      <aside className="shrink-0 ">
        <Sidebar />
      </aside>

      <main className="flex-1 flex flex-col">
        <NavBar />

        <section className="flex flex-col gap-8 pb-10">
          <Hero />

          <Filterdiv />

          <div className="px-6">
            <h2 className="text-4xl font-bold font-headingText text-primaryText mb-6 flex flex-col gap-2">
              Vibe Check
              <span className="text-sm font-light text-secondaryText font-subHeadingText tracking-wider">
                Playlist to match your current mood
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {playlists.map((playlist) => (
                <PlaylistCard
                  key={playlist.id}
                  title={playlist.title}
                  subtitle={playlist.subtitle}
                  image={playlist.image}
                  likes={playlist.likes}
                  songs={playlist.songs}
                  featured={playlist.featured}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
