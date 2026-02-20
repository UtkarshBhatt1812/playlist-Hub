import React from "react";

interface PlaylistMetaProps {
  title: string;
  description: string;
//   onChange: (data: { title?: string; description?: string }) => void;
}
//ON CHANGE FUNCTION FOR BOTH FIELDS, SO WE CAN UPDATE THE STATE IN PARENT COMPONENT

const PlaylistMeta: React.FC<PlaylistMetaProps> = ({
  title,
  description
}) => {
  return (
    <div className="flex flex-col gap-6 flex-1 font-smtext tracking-wide">


      <div className="flex flex-col">
        <label className="text-xs text-secondaryText">
          PLAYLIST TITLE
        </label>

        <input
          value={title}
          onChange={() => {}}
          placeholder="Enter Title..."
          className="
            mt-2 w-full rounded-xl border
            text-sm font-light
            border-white/50 bg-white/50
            backdrop-blur-md px-4 py-3
            outline-none
            focus:ring-1 focus:ring-purple-300/40
          "
        />
      </div>


      <div className="flex flex-col">
        <label className="text-xs text-secondaryText">
          DESCRIPTION
        </label>

        <textarea
          value={description}
          onChange={() => {}}
          rows={4}
          placeholder="Describe your playlist..."
          className="
            mt-2 w-full rounded-xl border
            text-sm font-light
            border-white/50 bg-white/50
            backdrop-blur-md px-4 py-3
            outline-none resize-none
            focus:ring-1 focus:ring-purple-300/40
          "
        />
      </div>

    </div>
  );
};

export default PlaylistMeta;
