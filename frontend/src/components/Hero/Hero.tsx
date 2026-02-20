import { PlayCircleIcon } from "lucide-react";

const Hero: React.FC = () => {
  return (
    <div className="mx-5 w-[96%] overflow-hidden rounded-4xl bg-transparent shadow-xl ">
      <div className="relative flex h-[50vh] flex-col justify-center rounded-4xl bg-[url('/Hero.png')]  bg-cover bg-center">
        <div className="absolute inset-0 rounded-4xl bg-gradient-to-r from-black/10 via-black/40 to-transparent"></div>

        <button className="text-accentText font-subHeadingText absolute top-6 left-6 z-10 rounded-full bg-white/90 px-4 py-1 text-sm font-medium tracking-wider backdrop-blur-md">Trending Now</button>

        <div className="absolute z-10 flex flex-col justify-center gap-6 px-10 selection:text-white/45">
          <div>
            <h1 className="flex flex-col text-5xl font-bold">
              <span className="text-[#2e2844]">Find your</span>

              <span className="from-accentText font-headingText bg-gradient-to-r from-40% to-[#fbad6cd8] bg-clip-text text-transparent">sonic sanctuary</span>
            </h1>

            <p className="mt-4 max-w-xl text-sm font-light text-[#2e2844]">
              Discover curated playlists across your favorite platforms.
              <br />
              Shared by a community of music lovers.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4">
            <button className="flex cursor-pointer items-center gap-2 rounded-full bg-[#2e2844] px-6 py-3 font-light text-white shadow-md transition-transform duration-200 hover:scale-105">
              <PlayCircleIcon className="h-4 w-4" /> Start Listening
            </button>

            <button className="text-primaryText cursor-pointer rounded-full bg-white/90 px-6 py-3 font-light shadow-md backdrop-blur-md transition-transform duration-200 hover:scale-105">Explore Generes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
