import React from "react";
import ProfileHeader from "../components/ProfilePage/ProfileHeader/ProfileHeader";
import ProfileTabs from "../components/ProfilePage/ProfileTabs/ProfileTabs";
import PlaylistGrid from "../components/ProfilePage/PlaylistGrid/PlaylistGrid";

const ProfilePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-10% via-60% via-[#f9f6ff] from-[#fefdff] to-[#fcfffe] px-10 py-8">
      <ProfileHeader
  avatar="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww&w=1000&q=80"
  name="DJ Alexia"
  bio="Curating the best lo-fi, synth-wave, and deep house tracks for your late-night coding sessions."
  location="New York, USA"
  website="alexiamusic.com"
  stats={[
    { label: "Followers", value: "12.5k" },
    { label: "Following", value: "240" },
    { label: "Total Saves", value: "50k" },
  ]}
/>

      <ProfileTabs />
      <PlaylistGrid />
    </div>
  );
};

export default ProfilePage;
