import React from "react";
import { Play, Heart, Download } from "lucide-react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggleLike } from "@/features/playlist/playlistThunks";




// iski saved list chalani h jo playlist slice me h, aur usme se check karna h ki kya current playlist saved h ya nahi, uske hisab se heart icon fill karna h ya nahi, aur toggleSave action dispatch karna h jab user save button pe click kare.
const PlaylistActions: React.FC<{ prevLiked: boolean }> = ({ prevLiked }  ) => {
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const playlistId = id

 const [isLiked, setIsLiked] = React.useState(prevLiked);

  const handleLike = async() => {
const result =  await dispatch(toggleLike(playlistId)).unwrap();
setIsLiked(prev=>!prev);

  };

  const handlePlay = () => {
  

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
        onClick={handleLike}
        className={`
          p-3 rounded-full
          transition-all duration-300
          cursor-pointer
          bg-neutral-200
          hover:scale-105
          ${isLiked ? "text-red-500" : "text-neutral-600 hover:text-red-500"}
          ${isLiked ? "scale-110 text-red-500" : ""}

        `}
      >
        <Heart size={16} fill={isLiked ? "red" : "none"} />
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
