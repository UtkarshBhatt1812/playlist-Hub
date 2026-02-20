import React from "react";
import CreatorCard from "./CreatorCard";
import PopularTags from "./PopularTags";

const SidebarPanel: React.FC = () => {
  return (
    <div className="w-80 flex flex-col gap-6">
      <CreatorCard />
      <PopularTags />
    </div>
  );
};

export default SidebarPanel;
