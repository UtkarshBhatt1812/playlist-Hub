import React from "react";
import { Play, Heart, Download } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useDispatch } from "react-redux";
import { toggleSave } from "@/features/playlist/playlistSlice";



// iski saved list chalani h jo playlist slice me h, aur usme se check karna h ki kya current playlist saved h ya nahi, uske hisab se heart icon fill karna h ya nahi, aur toggleSave action dispatch karna h jab user save button pe click kare.
const PlaylistActions: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const playlistId = Number(id);



  const allPlaylist = useAppSelector(state =>
    state.playlist.allPlaylist
  );
  const playlist = allPlaylist.find(p => p.id === playlistId);

  const isSaved = useAppSelector(state =>
    state.playlist.saved.some(p => p.id === playlistId)
  );

  console.log(playlist)
  const handleSave = () => {
    console.log('allPlaylist:', allPlaylist);
    if (!playlist) return;
    dispatch(toggleSave(playlist));
    console.log('playlist toggled:', playlist)
    

  };

  const handlePlay = () => {
    console.log("Playing playlist:", playlistId);
    // future: dispatch(playPlaylist(playlistId))
  };

  const handleDownload = () => {
    console.log("Downloading playlist:", playlistId);
  };

  return (
    <div className="flex gap-4 items-center">
      

      <button
        onClick={handlePlay}
        className="bg-primaryText hover:scale-105 transition-transform duration-300 text-white px-6 py-3 rounded-full flex items-center gap-2 cursor-pointer"
      >
        <Play size={16} />
        Play
      </button>


      <button
        onClick={handleSave}
        className={`
          p-3 rounded-full
          transition-all duration-300
          cursor-pointer
          bg-neutral-200
          hover:scale-105
          ${isSaved ? "text-red-500" : "text-neutral-600 hover:text-red-500"}
          ${isSaved ? "scale-110 text-red-500" : ""}

        `}
      >
        <Heart size={16} fill={isSaved ? "red" : "none"} />
      </button>


      <button
        onClick={handleDownload}
        className="p-3 rounded-full bg-neutral-200 hover:scale-105 cursor-pointer transition-all duration-300 text-neutral-600 hover:text-accentText"
      >
        <Download size={16} />
      </button>

    </div>
  );
};

export default PlaylistActions;
