import React from "react";
import { Play, Shuffle, MoreHorizontal, Search } from "lucide-react";
import SavedSongsTable from "@/components/SavedSongs/SavedSongstable";


const SavedSongsPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#f3f1ff] via-white to-[#eef2ff] px-10 py-8">


      <div className="flex gap-10 items-center">


        <div className="h-64 w-64 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-400 flex items-center justify-center shadow-xl">
          <div className="text-white text-6xl">❤</div>
        </div>


        <div className="flex flex-col gap-4">
          <p className="text-xs tracking-widest text-accentText font-medium">
            PLAYLIST
          </p>

          <h1 className="text-5xl font-bold text-primaryText">
            Saved Songs
          </h1>

          <p className="text-secondaryText">
            <span className="text-accentText font-semibold">245 songs</span>
            {" · "}
            14 hours 20 mins
          </p>


          <div className="flex gap-4 mt-4">
            <button className="px-6 py-3 rounded-full bg-gradient-to-r from-accentText to-purple-600 text-white flex items-center gap-2 shadow-lg hover:scale-105 transition">
              <Play size={16} />
              Play
            </button>

            <button className="px-6 py-3 rounded-full bg-neutral-100 text-primaryText flex items-center gap-2 hover:bg-neutral-200 transition">
              <Shuffle size={16} />
              Shuffle
            </button>

            <button className="p-3 rounded-full bg-neutral-100 hover:bg-neutral-200 transition">
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </div>


      <div className="flex justify-between items-center mt-12 bg-white/60 backdrop-blur-md p-4 rounded-2xl shadow-sm">

        <div className="flex items-center gap-3 text-secondaryText w-1/2">
          <Search size={18} />
          <input
            placeholder="Search in saved tracks..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>

        <div className="text-sm text-secondaryText">
          Sort by:{" "}
          <span className="text-accentText font-medium cursor-pointer">
            Recently Added
          </span>
        </div>
      </div>


      <div className="mt-8">
        <SavedSongsTable />
      </div>


      <div className="flex-grow" />


      {/* <MiniPlayer /> */}

    </div>
  );
};

export default SavedSongsPage;
