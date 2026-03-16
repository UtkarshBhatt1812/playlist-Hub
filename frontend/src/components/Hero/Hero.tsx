import { PlayCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";



interface HeroProps {
  onExploreClick: () => void;
}
const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const navigate = useNavigate();


  const handleStartListening = () => {
    navigate("/explore");
  };



  return (
    <div className="w-full px-4 sm:px-8">
      <div className="relative flex h-auto min-h-[45vh] sm:min-h-[50vh] flex-col justify-center rounded-3xl sm:rounded-4xl bg-[url('/Hero.png')] bg-cover bg-center overflow-hidden shadow-xl py-12 sm:py-16">

        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/40 to-transparent"></div>

        <button
          
          className="text-accentText font-subHeadingText absolute top-4 left-4 sm:top-6 sm:left-8 z-10 rounded-full bg-white/90 px-3 py-1.5 sm:px-4 sm:py-2 text-[10px] sm:text-xs font-semibold tracking-wider backdrop-blur-md uppercase"
        >
          Trending Now
        </button>

        <div className="relative z-10 flex flex-col justify-center gap-4 sm:gap-6 px-5 sm:px-10 lg:px-16 w-full lg:w-4/5 pt-8 sm:pt-0">

          <div>
            <h1 className="flex flex-col text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
              <span className="text-[#2e2844] mb-1 sm:mb-2 text-2xl sm:text-5xl lg:text-6xl">Find your</span>

              <span className="font-headingText bg-gradient-to-r from-accentText to-[#fbad6cd8] bg-clip-text text-transparent leading-tight sm:leading-snug">
                sonic sanctuary
              </span>
            </h1>

            <p className="mt-3 sm:mt-6 text-xs sm:text-base lg:text-lg font-medium sm:font-light text-[#2e2844] max-w-xs sm:max-w-md lg:max-w-xl leading-relaxed">
              Discover curated playlists across your favorite platforms.
              <br className="hidden sm:block" />
              Shared by a community of music lovers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-4 sm:mt-6">
            <button
              onClick={handleStartListening}
              className="
                flex cursor-pointer items-center justify-center gap-2
                rounded-full bg-[#2e2844]
                px-5 py-3 sm:px-8 sm:py-4 font-semibold sm:font-medium text-white text-xs sm:text-base
                shadow-lg shadow-[#2e2844]/20 transition-all duration-300
                hover:-translate-y-0.5 hover:shadow-xl w-full sm:w-auto
              "
            >
              <PlayCircleIcon className="h-4 w-4 sm:h-6 sm:w-6" />
              Start Listening
            </button>

            <button
              onClick={onExploreClick}
              className="
                text-primaryText cursor-pointer text-center
                rounded-full bg-white/90 w-full sm:w-auto
                px-5 py-3 sm:px-8 sm:py-4 font-semibold sm:font-medium text-xs sm:text-base
                shadow-lg shadow-black/5 backdrop-blur-md
                transition-all duration-300
                hover:-translate-y-0.5 hover:shadow-xl hover:bg-white 
              "
            >
              Explore Genres
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
