import React from "react";
import ProfileStats from "./ProfileStats";
import ProfileActions from "./ProfileActions";
import { MapPin, Link as LinkIcon } from "lucide-react";

interface ProfileHeaderProps {
  avatar: string;
  name: string;
  bio: string;
  location: string;
  website: string;
  stats: {
    label: string;
    value: string;
  }[];
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatar,
  name,
  bio,
  location,
  website,
  stats,
}) => {
  return (
    <div className="
      bg-white
      rounded-3xl
      p-8
      shadow-sm
      flex flex-col lg:flex-row
      justify-between
      gap-8
    ">


      <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center">


        <img
          src={avatar}
          alt={name}
          className="
            w-32 h-32
            rounded-full
            object-cover
            border-4 border-white
            shadow-md
          "
        />


        <div className="flex flex-col gap-3">

          <h1 className="text-4xl font-bold text-primaryText">
            {name}
          </h1>

          <p className="text-neutral-500 max-w-xl leading-relaxed">
            {bio}
          </p>

          <div className="flex flex-wrap gap-6 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{location}</span>
            </div>

            <div className="flex items-center gap-2">
              <LinkIcon size={16} />
              <span>{website}</span>
            </div>
          </div>

          <ProfileStats stats={stats} />
        </div>
      </div>


      <div className="self-start lg:self-center">
        <ProfileActions />
      </div>

    </div>
  );
};

export default ProfileHeader;
