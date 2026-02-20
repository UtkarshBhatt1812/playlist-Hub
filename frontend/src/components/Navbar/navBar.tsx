import React from "react";
import SearchBar from "./searchBar";
import ShareBtn from "./shareBtn";
import Notification from "./notification";
import Profile from "./profile";

const NavBar: React.FC = () => {
  return (
    <div className="flex items-center justify-between  p-4 text-black mt-8">
      <SearchBar />
      <div className="mx-2 flex items-center gap-[1vw]">
        <Notification />
        <ShareBtn />
        <Profile />
      </div>
    </div>
  );
};

export default NavBar;
