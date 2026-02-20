import React from "react";
import { Music4, Youtube } from "lucide-react";
const PlatformIndicators: React.FC = () => {
  return (
    //conditionally render based on the platform detected from the URL (not implemented yet)
    <div className="flex justify-center gap-6 mt-4 text-sm text-neutral-500">
      <span className="text-[#20d660] flex  items-center">Spotify</span>
       <span className="text-[#fa5a6a] flex gap-1 items-center"><Music4 className="w-4 h-4"/>Apple Music</span>
         <span className="text-[#ff0033] flex gap-1 items-center"><Youtube className="w-4 h-4"/>YouTube </span>
    </div>
  );
};

export default PlatformIndicators;
