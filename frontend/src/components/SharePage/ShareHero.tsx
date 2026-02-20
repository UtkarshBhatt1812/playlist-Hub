import React from "react";
import LinkInput from "./LinkInput";
import PlatformIndicators from "./PlatformIndicator";

const ShareHero: React.FC = () => {
  return (
    <div className="text-center mb-10 cursor-default">
      <h1 className="text-5xl font-bold text-primaryText">
        Share a Playlist
      </h1>

      <p className="text-neutral-500 mt-3 ">
        Paste your <span className="text-[#20d660]">Spotify</span>, <span className="text-[#fa5a6a]">Apple Music</span>, or <span className="text-[#ff0033]">YouTube </span>link to get started.
      </p>

      <div className="mt-6">
        <LinkInput />
        <PlatformIndicators />
      </div>
    </div>
  );
};

export default ShareHero;
