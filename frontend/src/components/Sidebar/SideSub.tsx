import type React from "react";
import {
  Home,
  Compass,
  Bookmark,
  HeartIcon,
  ListMusic,
} from "lucide-react";
import type { ElementType } from "react";
import { NavLink } from "react-router-dom";

interface NavItem {
  name: string;
  icon: ElementType;
  path: string;
}



const mainItems: NavItem[] = [
  { name: "Home", icon: Home, path: "/" },
  { name: "Explore", icon: Compass, path: "/explore" },
  { name: "Saved", icon: Bookmark, path: "/saved" },
];

const libraryItems: NavItem[] = [
  { name: "My Playlists", icon: ListMusic, path: "/my-playlists" },
  { name: "Saved Songs", icon: HeartIcon, path: "/saved-songs" },
];


interface NavListProps {
  items: NavItem[];
}

const NavList: React.FC<NavListProps> = ({ items }) => {
  return (
    <div className="flex flex-col gap-4 w-[90%]">
      {items.map(({ name, icon: Icon, path }) => (
        <NavLink
          key={name}
          to={path}
           // fixes root active issue
          className={({ isActive }) =>
            `
            flex items-center gap-3
            px-8 py-2
            rounded-xl
            transition-all duration-300
            text-[14px] font-light tracking-wide
            ease-in-out

            ${
              isActive
                ? "bg-white text-accentText translate-x-4 shadow-sm"
                : "text-secondaryText hover:bg-white hover:text-accentText hover:translate-x-4"
            }
            `
          }
        >
          <Icon className="w-5 h-5" />
          <span>{name}</span>
        </NavLink>
      ))}
    </div>
  );
};

const SideSub: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 w-full">

      <NavList items={mainItems} />

      <div className="text-[16px] font-subHeadingText tracking-wider flex px-14 cursor-default font-medium text-secondaryText">
        Library
      </div>

      <NavList items={libraryItems} />

    </div>
  );
};

export default SideSub;
