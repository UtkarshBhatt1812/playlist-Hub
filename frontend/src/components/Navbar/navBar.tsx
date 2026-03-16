import React from "react";
import SearchBar from "./searchBar";
import ShareBtn from "./shareBtn";
import Notification from "./notification";
import Profile from "./profile";
import { Menu } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";

const NavBar: React.FC = () => {
  const { toggleMobileOpen } = useSidebar();

  return (
    <div className="flex items-center justify-between p-3 sm:p-4 text-black mt-4 sm:mt-8 gap-2 sm:gap-4 z-10 relative ">
      <div className="flex items-center">
        {/* Mobile hamburger — visible only on small screens */}
        <button
          onClick={toggleMobileOpen}
          className="md:hidden p-2 rounded-lg text-secondaryText hover:text-accentText 
            hover:bg-white/60 transition-all duration-200"
          aria-label="Open sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <div className="flex-1 flex justify-center px-2 sm:px-4">
        <SearchBar />
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <Notification />
        <ShareBtn />
        <Profile />
      </div>
    </div>
  );
};

export default NavBar;
