import React from "react";

interface Stat {
  label: string;
  value: string;
}

interface ProfileStatsProps {
  stats: Stat[];
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  return (
    <div className="flex flex-wrap gap-10 mt-6 text-primaryText">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col">
          <h3 className="text-xl font-bold  tracking-wide font-headingText">
            {stat.value}
          </h3>
          <p className="text-xs font-smtext tracking-wide text-secondaryText">
            {stat.label.toUpperCase()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProfileStats;
