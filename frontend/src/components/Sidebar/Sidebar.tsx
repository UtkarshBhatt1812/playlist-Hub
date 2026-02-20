import SidebarHead from "./SidebarHead";
import SideSub from "./SideSub";
import SideFoot from "./SideFoot";
import { Plus } from "lucide-react";

const NewPlaylistBtn: React.FC = () => {
  return (
    <div className="bg-primaryText w-[80%] font-subHeadingText flex cursor-pointer
       items-center justify-center gap-2 rounded-full p-2 text-sm font-light 
       tracking-wider text-white transition-transform duration-300 hover:scale-105 ">
      <Plus className="h-4 w-4" />
      New Playlist
    </div>
  );
}

const Sidebar: React.FC = () => {
  return (
    <div className="flex h-screen w-xs items-center sticky top-0">
      <div className="backdrop:bg-accentText mx-6 gap-5 flex h-[90%] w-xs flex-col 
      items-center justify-center 
      rounded-[40px] border bg-linear-to-b from-[#fbf7fc] from-50% to-white">
        <SidebarHead></SidebarHead>
        <SideSub></SideSub>
        <SideFoot></SideFoot>
        <NewPlaylistBtn></NewPlaylistBtn>
      </div>
    </div>
  );
};

export default Sidebar;