import React from "react";

interface TagSectionProps {
  moods: string[];
  genres: string[];
  selectedMoods: string[];
  selectedGenres: string[];
  onChange: (data: {
    moods?: string[];
    genres?: string[];
  }) => void;
}

const TagSection: React.FC<TagSectionProps> = ({
  moods,
  genres,
  selectedMoods,
  selectedGenres,
  onChange,
}) => {
  const toggleMood = (mood: string) => {
    const updated = selectedMoods.includes(mood)
      ? selectedMoods.filter((m) => m !== mood)
      : [...selectedMoods, mood];

    onChange({ moods: updated });
  };

  const toggleGenre = (genre: string) => {
    const updated = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];

    onChange({ genres: updated });
  };

  return (
    <div className="mt-8 flex justify-between">


      <div>
        <h3 className="mb-3 text-xs text-primaryText">MOODS</h3>

        <div className="flex flex-wrap gap-3">
          {moods.map((mood) => {
            const active = selectedMoods.includes(mood);

            return (
              <button
                key={mood}
                onClick={() => toggleMood(mood)}
                className={`
                  rounded-full px-4 py-2 text-sm
                  transition-all duration-200
                  hover:scale-105
                  ${
                    active
                      ? "bg-purple-600 text-white"
                      : "bg-purple-300/80 text-white"
                  }
                `}
              >
                {mood}
              </button>
            );
          })}
        </div>
      </div>

      {/* GENRES */}
      <div>
        <h3 className="mb-3 text-xs text-primaryText">GENRES</h3>

        <div className="flex flex-wrap gap-3">
          {genres.map((genre) => {
            const active = selectedGenres.includes(genre);

            return (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`
                  rounded-full px-4 py-2 text-sm
                  transition-all duration-200
                  hover:scale-105
                  ${
                    active
                      ? "bg-purple-600 text-white"
                      : "bg-purple-300/80 text-white"
                  }
                `}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default TagSection;
