import type React from "react";
import { Search } from "lucide-react";
import SubtleBouncingBalls from "./stubleBouncingBalls";

//Selection add krna h
const SearchBar: React.FC = () => {
  return (
    <div className="font-heading relative flex h-11 w-[80%] items-center justify-center font-extralight transition-transform duration-300 hover:scale-101">
      <input type="text" name="search" id="search" placeholder="Search for artist,song or dreamy vibes..." className="flex h-full w-full rounded-4xl border border-neutral-200 py-2 pl-12 tracking-widest  caret-neutral-400 shadow-sm shadow-neutral-100 backdrop-blur-md placeholder:text-sm placeholder:text-neutral-400 hover:shadow-md focus:ring-[0.5px] focus:outline-none" />
      <Search className="top-2.1 absolute left-3 h-4 w-6 invert-60 " />
      <SubtleBouncingBalls />
    </div>
  );
};
export default SearchBar;
