import  { useState, useMemo } from "react";
import Filterbtn from "./Filterbtn";

const genres = [
  "Pop",
  "Hip Hop",
  "Rock",
  "Jazz",
  "EDM",
  "Classical",
  "Indie",
  "Lo-fi",
  "R&B",
  "Punjabi",
];

function Filterdiv() {
  const [showAll, setShowAll] = useState(false);

  const visibleGenres = useMemo(
    () => (showAll ? genres : genres.slice(0, 5)),
    [showAll]
  );

  return (
    <section className="mx-auto mt-12 mb-8 w-[96%] max-w-7xl">


      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primaryText">
          Top Genres
        </h2>

        <button
          onClick={() => setShowAll((prev) => !prev)}
          className="
            rounded-full bg-accentText/10
            px-4 py-2 text-xs
            font-subHeadingText text-accentText
            transition-all duration-200
            hover:bg-accentText/30
            active:scale-95
          "
        >
          {showAll ? "Show less" : "View all"}
        </button>
      </div>


      <div className="mt-6 flex flex-wrap gap-3">
        {visibleGenres.map((genre) => (
          <Filterbtn key={genre} label={genre} />
        ))}
      </div>

    </section>
  );
}

export default Filterdiv;
