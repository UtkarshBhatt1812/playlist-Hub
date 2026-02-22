import React from "react";
import { Link } from "react-router-dom";
import { Home, Compass, Headphones } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div
      className="
        min-h-screen
        flex flex-col
        items-center
        justify-center
        relative
        overflow-hidden
        bg-gradient-to-br
        from-[#f3ecff]
        via-[#f8f6ff]
        to-[#eaf6ff]
      "
    >

      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-300/30 blur-3xl rounded-full" />
      <div className="absolute bottom-10 right-20 w-72 h-72 bg-blue-300/30 blur-3xl rounded-full" />


      <div
        className="
          relative
          w-full max-w-2xl
          text-center
          bg-white/40
          backdrop-blur-xl
          rounded-3xl
          shadow-xl
          p-10
        "
      >

        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 flex items-center justify-center rounded-full bg-white/10 shadow-sm ">
            <Headphones className="w-10 h-10 text-accentText" />
    </div>
        </div>


        <h1
          className="
            text-7xl font-bold
           text-smtext
           font-headingText
           text-primaryText
          "
        >
          404
        </h1>


        <h2 className="mt-4 text-2xl font-semibold text-primaryText">
          Oops! You are on a page that doesn't exist!
        </h2>

        <p className="mt-3 text-secondaryText text-sm max-w-md mx-auto">
          The track you're looking for might have been moved or deleted.
          Let’s get you back to the rhythm.
        </p>

        


        <div className="mt-8 flex gap-4 justify-center flex-wrap">
          <Link
            to="/"
            className="
              flex items-center gap-2
              px-6 py-3
              rounded-full
              bg-gradient-to-r
              from-purple-500
              to-purple-700
              text-white
              shadow-lg
              hover:scale-105
              transition-all duration-300
            "
          >
            <Home size={16} />
            Back to Home
          </Link>

          <Link
            to="/explore"
            className="
              flex items-center gap-2
              px-6 py-3
              rounded-full
              border
              bg-white text-primaryText
              shadow-sm
              hover:shadow-md
              hover:-translate-y-0.5
              transition-all duration-300
            "
          >
            <Compass size={16} />
            Explore Discover
          </Link>
        </div>

        
      </div>
    </div>
  );
};

export default NotFound;
