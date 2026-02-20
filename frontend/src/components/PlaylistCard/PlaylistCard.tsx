import React from "react";
import { Heart, Clock, Play } from "lucide-react";

interface PlaylistCardProps {
  title: string;
  subtitle: string;
  image: string;
  likes: string;
  songs: number;
  featured?: boolean;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  title,
  subtitle,
  image,
  likes,
  songs,
  featured = false,
}) => {
  return (
    <div className="w-[23vw] rounded-3xl bg-linear-to-br from-[#fbf7fc] from-50% to-white shadow-xl p-5 relative hover:scale-102 transition-transform hover:-translate-x-2.25 hover:-translate-y-2.25">


      <div
        className="relative h-60 w-full rounded-2xl bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        {featured && (
          <span className="absolute top-4 left-4 text-xs px-4 py-1 rounded-full bg-white/40 backdrop-blur-md text-white tracking-widest">
            FEATURED
          </span>
        )}
      </div>


      <div className="mt-6 cursor-default">
        <h3 className="text-2xl font-bold text-[#2e2844]">
          {title}
        </h3>

        <p className="text-neutral-500 mt-1">
          {subtitle}
        </p>
      </div>


      <div className="border-t border-neutral-200 my-4"></div>


      <div className="flex items-center justify-between text-neutral-500 text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Heart size={16} />
            <span>{likes}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{songs} Songs</span>
          </div>
        </div>


        <button className="absolute cursor-pointer right-6 bottom-20 h-14 w-14 rounded-full bg-primaryText flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
          <Play size={20} color="white" fill="white"  />
        </button>
      </div>
    </div>
  );
};

export default PlaylistCard;
