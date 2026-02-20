import React from "react";
import CoverUpload from "./CoverUpload";
import PlaylistMeta from "./PlaylistMeta";
import TagSection from "./TagSection";
import ActivitySection from "./ActivitySection";
import PublishSection from "./PublishSection";

//handle tag change banana h 

const PlaylistEditor: React.FC = () => {
    
  return (
    <div className="w-225 rounded-3xl border  p-10 shadow-2xl backdrop-blur-2xl">
      <div className="flex gap-10">
        <CoverUpload />
        <PlaylistMeta title={""}
  description={""}
 />
      </div>

      <TagSection
  moods={["Chill", "Focus", "Melancholy", "Relaxing"]}
  genres={["Lo-Fi", "Hip Hop", "Jazz"]}
  selectedMoods={[]}
  selectedGenres={[]}
  onChange={()=>{}}
/>
      <ActivitySection />
      <PublishSection />
    </div>
  );
};

export default PlaylistEditor;
