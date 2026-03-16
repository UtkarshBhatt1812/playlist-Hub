import SidebarHead from "./SidebarHead";
import SideSub from "./SideSub";
import SideFoot from "./SideFoot";
import { Plus, Menu, X } from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { useNavigate } from "react-router-dom";

const NewPlaylistBtn: React.FC = () => {
  const navigate = useNavigate();
  const { isCollapsed } = useSidebar();

  return (
    <div
      className={`bg-primaryText font-subHeadingText flex cursor-pointer
        items-center justify-center gap-2 rounded-full p-2 text-sm font-light 
        tracking-wider text-white transition-all duration-300 hover:scale-105
        ${isCollapsed ? "w-10 h-10 p-0" : "w-[80%]"}`}
      onClick={() => navigate("/create")}
      title={isCollapsed ? "New Playlist" : undefined}
    >
      <Plus className="h-4 w-4 shrink-0" />
      {!isCollapsed && <span>New Playlist</span>}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebar();

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={closeMobile}
        />
      )}

      <div
        className={`
          items-center transition-all duration-300 ease-in-out 
          ${isMobileOpen ? "fixed inset-y-0 left-0 z-50 flex w-20 " : "hidden"}
          md:sticky md:top-0 md:flex md:h-screen
          ${isCollapsed ? "md:w-24" : "md:w-xs"}
        `}
      >
        <div
          className={`
            backdrop:bg-accentText mx-3 my-4 gap-5 flex h-[calc(100vh-2rem)] w-[calc(100%-1.5rem)] flex-col 
            items-center justify-center 
            rounded-[40px] border bg-linear-to-b from-[#fbf7fc] from-50% to-white
            transition-all duration-300
            md:mx-4 md:my-0 md:h-[90%] md:w-[calc(100%-2rem)]
            ${isCollapsed ? "md:w-full" : "md:w-xs"}
          `}
        >
          <button
            onClick={closeMobile}
            className="flex ml-5 mr-4 mt-2 rounded-lg p-1.5 text-secondaryText transition-all duration-200 hover:bg-white/60 hover:text-accentText md:hidden"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>

          <button
            onClick={toggleCollapse}
            className="hidden self-end mr-4 mt-2 rounded-lg p-1.5 text-secondaryText transition-all duration-200 hover:bg-white/60 hover:text-accentText md:inline-flex"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="h-5 w-5" />
          </button>

          <SidebarHead />
          <SideSub />
          {!isCollapsed && <SideFoot />}
          <NewPlaylistBtn />
        </div>
      </div>
    </>
  );
};

export default Sidebar;
