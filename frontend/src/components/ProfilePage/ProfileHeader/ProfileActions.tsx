import React from "react";
import { Music2, Share2, UserPlus } from "lucide-react";

interface ProfileActionsProps {
  isOwnProfile: boolean;
  isFollowing: boolean;
  isFollowLoading: boolean;
  spotifyConnected: boolean;
  spotifyProduct: string;
  spotifyDisplayName: string;
  isSpotifyActionLoading: boolean;
  onFollow: () => void;
  onShare: () => void;
  onSpotifyAction: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({
  isOwnProfile,
  isFollowing,
  isFollowLoading,
  spotifyConnected,
  spotifyProduct,
  spotifyDisplayName,
  isSpotifyActionLoading,
  onFollow,
  onShare,
  onSpotifyAction,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {isOwnProfile && (
        <button
          type="button"
          onClick={onSpotifyAction}
          disabled={isSpotifyActionLoading}
          className={`rounded-full px-6 py-2 flex items-center gap-2 transition-transform duration-200 disabled:cursor-not-allowed disabled:opacity-70 ${
            spotifyConnected
              ? "border border-[#1DB954] text-[#1DB954] hover:scale-105"
              : "bg-[#1DB954] text-white hover:scale-105"
          }`}
        >
          <Music2 size={16} />
          {isSpotifyActionLoading
            ? "Updating..."
            : spotifyConnected
              ? `Disconnect Spotify${spotifyProduct ? ` (${spotifyProduct})` : ""}`
              : "Connect Spotify"}
        </button>
      )}

      {isOwnProfile && spotifyConnected && spotifyDisplayName ? (
        <p className="text-xs text-secondaryText">
          Connected as <span className="font-semibold text-primaryText">{spotifyDisplayName}</span>
        </p>
      ) : null}

      {!isOwnProfile && (
        <button
          type="button"
          onClick={onFollow}
          disabled={isFollowLoading}
          className="bg-primaryText text-white px-6 py-2 rounded-full flex hover:text-accentText items-center gap-2 hover:scale-105 cursor-pointer transition-transform duration-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <UserPlus size={16} />
          {isFollowLoading ? "Updating..." : isFollowing ? "Following" : "Follow"}
        </button>
      )}

      <button
        type="button"
        onClick={onShare}
        className="border px-6 py-2 rounded-full flex items-center gap-2 hover:text-accentText hover:scale-105 cursor-pointer transition-transform duration-200"
      >
        <Share2 size={16} />
        Share
      </button>
    </div>
  );
};

export default ProfileActions;
