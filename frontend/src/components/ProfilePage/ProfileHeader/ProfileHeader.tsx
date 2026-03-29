import React from "react";
import ProfileStats from "./ProfileStats";
import ProfileActions from "./ProfileActions";

interface ProfileHeaderProps {
  avatar: string;
  name: string;
  username: string;
  summary: string;
  stats: {
    label: string;
    value: string;
  }[];
  isOwnProfile: boolean;
  isFollowing: boolean;
  isFollowLoading: boolean;
  isUploadingAvatar: boolean;
  spotifyConnected: boolean;
  spotifyProduct: string;
  spotifyDisplayName: string;
  isSpotifyActionLoading: boolean;
  onFollow: () => void;
  onShare: () => void;
  onAvatarClick: () => void;
  onSpotifyAction: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatar,
  name,
  username,
  summary,
  stats,
  isOwnProfile,
  isFollowing,
  isFollowLoading,
  isUploadingAvatar,
  spotifyConnected,
  spotifyProduct,
  spotifyDisplayName,
  isSpotifyActionLoading,
  onFollow,
  onShare,
  onAvatarClick,
  onSpotifyAction,
}) => {
  const avatarImage = (
    <img
      src={avatar || "/image.svg"}
      alt={name}
      onError={(event) => {
        event.currentTarget.src = "/image.svg";
      }}
      className="
        w-32 h-32
        rounded-full
        object-cover
        border-4 border-white
        shadow-md
      "
    />
  );

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
        {isOwnProfile ? (
          <button
            type="button"
            onClick={onAvatarClick}
            className="group relative shrink-0 cursor-pointer"
          >
            {avatarImage}
            <span className="absolute inset-x-2 bottom-2 rounded-full bg-black/70 px-3 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              {isUploadingAvatar ? "Uploading..." : "Show or change"}
            </span>
          </button>
        ) : (
          avatarImage
        )}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold text-primaryText">
            {name}
          </h1>

          <p className="text-sm font-medium tracking-wide text-accentText">
            @{username}
          </p>

          <p className="text-neutral-500 max-w-xl leading-relaxed">
            {summary}
          </p>

          <ProfileStats stats={stats} />
        </div>
      </div>
      <div className="self-start lg:self-center">
        <ProfileActions
          isOwnProfile={isOwnProfile}
          isFollowing={isFollowing}
          isFollowLoading={isFollowLoading}
          spotifyConnected={spotifyConnected}
          spotifyProduct={spotifyProduct}
          spotifyDisplayName={spotifyDisplayName}
          isSpotifyActionLoading={isSpotifyActionLoading}
          onFollow={onFollow}
          onShare={onShare}
          onSpotifyAction={onSpotifyAction}
        />
      </div>
    </div>
  );
};

export default ProfileHeader;
