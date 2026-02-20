import React from "react";

const PopularTags: React.FC = () => {
  const tags = ["#Workout", "#Party", "#Gaming", "#Sleep"];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold">Popular Tags</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span key={tag} className="text-primaryText font-smtext rounded-full bg-neutral-300/40 px-3 py-1 text-xs font-light">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PopularTags;
