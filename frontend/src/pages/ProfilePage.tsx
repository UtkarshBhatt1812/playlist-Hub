import React, { useEffect, useMemo, useRef, useState } from "react";
import type { AxiosError } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ProfileHeader from "../components/ProfilePage/ProfileHeader/ProfileHeader";
import ProfileTabs from "../components/ProfilePage/ProfileTabs/ProfileTabs";
import PlaylistGrid from "../components/ProfilePage/PlaylistGrid/PlaylistGrid";
import api from "@/services/api";
import { setUserImage } from "@/features/auth/authSlice";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import type { ProfileTab, UserProfile } from "@/features/profile/profile.types";

type ProfileResponse = {
  profile: UserProfile;
};

type ToggleFollowResponse = {
  following: boolean;
  followersCount: number;
};

type ApiErrorResponse = {
  message?: string;
};

type UpdateProfileImageResponse = {
  image?: string;
  user?: {
    image?: string;
  };
};

const formatStat = (value: number) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: value >= 1000 ? 1 : 0,
  }).format(value);

const ProfilePage: React.FC = () => {
  const { id: profileId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(
    (state) => state.auth.user.isAuthenticated,
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTab>("playlists");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [isPhotoMenuOpen, setIsPhotoMenuOpen] = useState(false);
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileId) {
        setLoadError("Profile not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setLoadError(null);
        setActionError(null);

        const response = await api.get<ProfileResponse>(`/users/${profileId}/profile`);
        const nextProfile = response.data.profile;

        setProfile(nextProfile);
        setActiveTab((currentTab) =>
          nextProfile.isOwnProfile ? currentTab : "playlists",
        );
      } catch (err) {
        const apiError = err as AxiosError<ApiErrorResponse>;
        setLoadError(apiError.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  const displayedPlaylists = useMemo(() => {
    if (!profile) {
      return [];
    }

    return activeTab === "saved" ? profile.savedPlaylists : profile.playlists;
  }, [activeTab, profile]);

  const handleFollowToggle = async () => {
    if (!profileId || !profile || profile.isOwnProfile || isFollowLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    try {
      setIsFollowLoading(true);
      setActionError(null);

      const response = await api.post<ToggleFollowResponse>(`/users/${profileId}/follow`);

      setProfile((currentProfile) => {
        if (!currentProfile) {
          return currentProfile;
        }

        return {
          ...currentProfile,
          isFollowing: response.data.following,
          followersCount: response.data.followersCount,
        };
      });
    } catch (err) {
      const apiError = err as AxiosError<ApiErrorResponse>;
      setActionError(
        apiError.response?.data?.message || "Failed to update follow state.",
      );
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleAvatarClick = () => {
    if (!profile?.isOwnProfile || isUploadingAvatar) {
      return;
    }

    setActionError(null);
    setIsPhotoMenuOpen(true);
  };

  const handleShowPhoto = () => {
    setIsPhotoMenuOpen(false);
    setIsPhotoViewerOpen(true);
  };

  const handleChangePhoto = () => {
    setIsPhotoMenuOpen(false);
    fileInputRef.current?.click();
  };

  const handlePhotoFileChange: React.ChangeEventHandler<HTMLInputElement> = async (
    event,
  ) => {
    const file = event.target.files?.[0];

    if (!file || !profile?.isOwnProfile) {
      return;
    }

    try {
      setIsUploadingAvatar(true);
      setActionError(null);

      const formData = new FormData();
      formData.append("image", file);

      const response = await api.patch<UpdateProfileImageResponse>(
        "/users/profile/image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const nextImage = response.data.user?.image || response.data.image || "";

      if (!nextImage) {
        throw new Error("Profile image was not returned by the server.");
      }

      setProfile((currentProfile) =>
        currentProfile
          ? {
            ...currentProfile,
            image: nextImage,
          }
          : currentProfile,
      );
      dispatch(setUserImage(nextImage));
    } catch (err) {
      const apiError = err as AxiosError<ApiErrorResponse>;
      setActionError(
        apiError.response?.data?.message || "Failed to update profile image.",
      );
    } finally {
      event.target.value = "";
      setIsUploadingAvatar(false);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/profile/${profileId}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: profile ? `${profile.name} on PlaylistHub` : "PlaylistHub Profile",
          url: shareUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(shareUrl);
    } catch (error) {
      console.log(error);
      // Ignore cancelled share or clipboard permission issues.
    }
  };

  const handleSavedChange = (playlistId: string, saved: boolean) => {
    if (saved) {
      return;
    }

    setProfile((currentProfile) => {
      if (!currentProfile) {
        return currentProfile;
      }

      const nextSavedPlaylists = currentProfile.savedPlaylists.filter(
        (playlist) => playlist._id !== playlistId,
      );

      return {
        ...currentProfile,
        savedPlaylists: nextSavedPlaylists,
        totalSaves: nextSavedPlaylists.length,
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-10% via-60% via-[#f9f6ff] from-[#fefdff] to-[#fcfffe] px-10 py-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm text-secondaryText">
          Loading profile...
        </div>
      </div>
    );
  }

  if (loadError || !profile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-10% via-60% via-[#f9f6ff] from-[#fefdff] to-[#fcfffe] px-10 py-8">
        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-primaryText">Profile unavailable</h1>
          <p className="mt-2 text-secondaryText">
            {loadError || "We could not load this profile."}
          </p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Followers", value: formatStat(profile.followersCount) },
    { label: "Following", value: formatStat(profile.followingCount) },
    { label: "Total Saves", value: formatStat(profile.totalSaves) },
  ];

  const emptyMessage = activeTab === "saved"
    ? "You have not saved any playlists yet."
    : profile.isOwnProfile
      ? "You have not created any playlists yet."
      : "This user has not shared any playlists yet.";

  return (
    <div className="min-h-screen bg-linear-to-br from-10% via-60% via-[#f9f6ff] from-[#fefdff] to-[#fcfffe] px-10 py-8">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handlePhotoFileChange}
      />

      <ProfileHeader
        avatar={profile.image}
        name={profile.name}
        username={profile.username}
        summary={
          profile.isOwnProfile
            ? "Track your followers, your public playlists, and everything you have saved."
            : "Browse this creator's public playlists and follow them for updates."
        }
        stats={stats}
        isOwnProfile={profile.isOwnProfile}
        isFollowing={profile.isFollowing}
        isFollowLoading={isFollowLoading}
        isUploadingAvatar={isUploadingAvatar}
        onFollow={handleFollowToggle}
        onShare={handleShare}
        onAvatarClick={handleAvatarClick}
      />

      {actionError && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {actionError}
        </div>
      )}

      <ProfileTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        showSavedTab={profile.isOwnProfile}
      />
      <PlaylistGrid
        playlists={displayedPlaylists}
        emptyMessage={emptyMessage}
        onSavedChange={activeTab === "saved" ? handleSavedChange : undefined}
      />

      {isPhotoMenuOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setIsPhotoMenuOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-primaryText">Profile Photo</h2>
            <p className="mt-2 text-sm text-secondaryText">
              Choose what you want to do with your current profile photo.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={handleShowPhoto}
                className="rounded-2xl border border-neutral-200 px-4 py-3 text-left font-medium text-primaryText transition hover:border-primaryText"
              >
                Show photo
              </button>
              <button
                type="button"
                onClick={handleChangePhoto}
                className="rounded-2xl bg-primaryText px-4 py-3 text-left font-medium text-white transition hover:opacity-90"
              >
                Change photo
              </button>
            </div>
          </div>
        </div>
      )}

      {isPhotoViewerOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 px-4"
          onClick={() => setIsPhotoViewerOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-white p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsPhotoViewerOpen(false)}
              className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1 text-sm text-white"
            >
              Close
            </button>
            <img
              src={profile.image || "/image.svg"}
              alt={profile.name}
              className="max-h-[80vh] w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
