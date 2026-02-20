import React from "react";

const LinkInput: React.FC = () => {
  return (
    <div className="
      mt-6
      backdrop-blur-xl
      bg-white/30
      border border-white/40
      shadow-xl
      rounded-full
      flex items-center
      px-6 py-3
      w-150
      mx-auto
    ">
      <input
        placeholder="Paste playlist URL..."
        className="flex-1 bg-transparent font-smtext tracking-wide placeholder:tracking-wider text-sm outline-none text-primaryText placeholder:text-secondaryText"
      />

      <button className="
      font-smtext font-extralight
       bg-purple-400
        text-white
        px-6 py-2
        rounded-full
        shadow-lg cursor-pointer
      ">
        Fetch Metadata
      </button>
    </div>
  );
};

export default LinkInput;
