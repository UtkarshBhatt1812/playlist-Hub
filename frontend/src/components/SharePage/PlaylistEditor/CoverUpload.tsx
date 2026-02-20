import {  XIcon } from "lucide-react";

import React, { useRef, useState} from "react";

const CoverUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [image, setImage] = useState<string | null>(() => {
  return localStorage.getItem("playlist-cover");
});


  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImage(base64);


      localStorage.setItem("playlist-cover", base64);
    };

    reader.readAsDataURL(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-3">

    
      <div
        className="
          w-64 h-64
          rounded-2xl
          overflow-hidden
          shadow-xl
            bg-purple-200
          flex items-center justify-center
        "
      >
        {
            image && <button
        onClick={() => {
          setImage(null);
          localStorage.removeItem("playlist-cover");
        }}
        className="
          text-secondaryText
          text-md white absolute top-14 left-[29%] z-10
          transition-all duration-300
          hover:scale-105
          cursor-pointer
        "
      >
        <XIcon size={20} />
      </button>
        }
        {image ? (
          <img
            src={image}
            alt="Playlist Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-white/70 text-sm">
            No Cover Selected
          </span>
        )}
      </div>


      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleImageChange}
        className="hidden"
      />


      <button
        onClick={handleButtonClick}
        className="
          text-secondaryText
          text-sm font-medium
          transition-all duration-300
          hover:underline
          hover:scale-105
          hover:text-accentText
          cursor-pointer
        "
      >
        Change Cover Image
      </button>
      

    </div>
  );
};

export default CoverUpload;
