import React, { useState, useMemo } from "react";

const dummyActivities = [
  "Studying",
  "Coding",
  "Driving",
  "Gaming",
  "Workout",
  "Meditation",
  "Reading",
  "Late Night Chill",
  "Focus Session",
  "Party Mode",
];

const ActivitySection: React.FC = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  const filteredActivities = useMemo(() => {
    if (!query) return [];
    return dummyActivities.filter((activity) =>
      activity.toLowerCase().includes(query.toLowerCase())
    );
  }, [query]);

  const handleSelect = (activity: string) => {
    if (!selected.includes(activity)) {
      setSelected([...selected, activity]);
    }
    setQuery("");
  };

  const removeActivity = (activity: string) => {
    setSelected(selected.filter((a) => a !== activity));
  };

  return (
    <div className="mt-8 font-smtext relative">
      <h3 className="text-secondaryText mb-3 text-xs">
        BEST FOR... (ACTIVITY)
      </h3>


      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search activities (e.g. Studying, Gaming)..."
        className="
          w-full rounded-full border
          bg-white/50 px-6 py-3 text-sm font-extralight
          backdrop-blur-md outline-none
          placeholder:tracking-wider
        "
      />


      {filteredActivities.length > 0 && (
        <div className="
          absolute z-10 mt-2 w-full
          rounded-2xl bg-white/70 backdrop-blur-xl
          border shadow-lg
          overflow-hidden font-smtext font-extralight
        ">
          {filteredActivities.map((activity) => (
            <div
              key={activity}
              onClick={() => handleSelect(activity)}
              className="
                px-6 py-3 cursor-pointer text-sm
                hover:bg-purple-100 transition-colors
              "
            >
              {activity}
            </div>
          ))}
        </div>
      )}


      {selected.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-4">
          {selected.map((activity) => (
            <div
              key={activity}
              className="
                px-4 py-2 text-sm
                bg-purple-300 text-white
                rounded-full flex items-center gap-2
              "
            >
              {activity}
              <button
                onClick={() => removeActivity(activity)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivitySection;
