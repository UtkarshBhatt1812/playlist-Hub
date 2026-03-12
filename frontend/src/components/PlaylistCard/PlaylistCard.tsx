import { Play, Heart, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { toggleSave } from "@/features/playlist/playlistSlice";
import type { RootState } from "@/app/store";

interface Playlist {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  likes?: string[];
  songs?: number;
  featured?: boolean;
  totalLikes ?: number;
}

interface PlaylistCardProps {
  playlist: Playlist;
  className?: string;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  className = "",
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const savedPlaylists = null

  const isSaved = null;
  const {
    id,
    title,
    subtitle,
    image,
    likes,
    songs,
    featured ,
    totalLikes
  } = playlist;

  const handlePlay = () => {
    navigate(`/playlist/${id}`);
  };

  const handleSave = () => {
    // dispatch(toggleSave(playlist));
  };

  return (
    <div
      className={`
        w-full rounded-2xl bg-gradient-to-br
        from-[#fbf7fc] to-white shadow-md px-4 py-3 relative
        transition-all duration-300 hover:-translate-y-2 hover:shadow-xl 
        ${className}
      `}
    >

      <div
        className="relative h-44 w-full rounded-xl bg-size-[100%_100%] bg-repeat-y bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        {featured && (
          <span className="absolute top-3 left-3 text-[10px] px-3 py-1 rounded-full bg-white/40 backdrop-blur-md text-white tracking-widest">
            FEATURED
          </span>
        )}


        <button
          onClick={handleSave}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur-md p-2 rounded-full shadow hover:scale-110 transition"
        >
          <Heart
            size={14}
            className={isSaved ? "text-red-500 fill-red-500" : "text-gray-500"}
          />
        </button>
      </div>


      <div className="mt-4">
        <h3 className="text-lg font-bold text-[#2e2844] truncate">
          {title}
        </h3>
        <p className="text-neutral-500 text-sm mt-1 truncate">
          {subtitle}
        </p>
      </div>

      <div className="border-t border-neutral-200 my-3"></div>

      <div className="flex items-center justify-between text-neutral-500 text-xs relative  ">
        <div className="flex items-center gap-4">
          {likes && (
            <div className="flex items-center gap-1">
              <Heart size={14} />
              <span>{totalLikes}</span>
            </div>
          )}
          {songs !== undefined && (
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{songs} Songs</span>
            </div>
          )}
        </div>

        <button
          onClick={handlePlay}
          className=" h-10 w-10 rounded-full bg-primaryText flex items-center justify-center shadow-md hover:scale-105 transition-transform"
        >
          <Play size={16} color="white" fill="white" />
        </button>
      </div>
    </div>
  );
};

export default PlaylistCard;
