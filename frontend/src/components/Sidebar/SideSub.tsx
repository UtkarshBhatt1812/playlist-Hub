import type React from "react";
import {
  Home,
  Compass,
  Bookmark,
  HeartIcon,
  ListMusic,
} from "lucide-react";
import type { ElementType } from "react";

interface NavItem {
  name: string;
  icon: ElementType;
}

/* ================= DATA ================= */

const mainItems: NavItem[] = [
  { name: "Home", icon: Home },
  { name: "Explore", icon: Compass },
  { name: "Saved", icon: Bookmark },
];

const libraryItems: NavItem[] = [
  { name: "My Playlists", icon: ListMusic },
  { name: "Saved Songs", icon: HeartIcon },
];



interface NavListProps {
  items: NavItem[];
}

const NavList: React.FC<NavListProps> = ({ items }) => {
  return (
    <div className="flex flex-col gap-4   w-[90%]">
      {items.map(({ name, icon: Icon }) => (
        <div
          key={name}
          className="
            flex items-center gap-3
            px-8 py-2  
            rounded-xl
            cursor-pointer
            transition-all duration-300
            hover:bg-white hover:text-accentText
             text-secondaryText font-smtext  text-[14px] font-light tracking-wide
             hover:translate-x-6 ease-in-out
          "
        >
          <Icon className="w-5 h-5" />
          <span >
            {name}
          </span>
        </div>
      ))}
    </div>
  );
};



const SideSub: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full">
      <NavList items={mainItems} />

      <div className="text-[16px] font-subHeadingText tracking-wider flex px-14 cursor-default font-medium text-secondaryText ">
        Library
      </div>
      <NavList items={libraryItems} />
    </div>
  );
};

export default SideSub;
