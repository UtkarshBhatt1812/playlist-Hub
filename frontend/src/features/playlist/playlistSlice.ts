import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Playlist, PlaylistState } from "./playlist.types";

const initialState: PlaylistState = {
  saved: [],
  myPlaylist:[{
      id: 1,
      title: "Late Night Lo-Fi",
      subtitle: "By PlaylistHub Curators",
      image: "/Hero.png",
      likes: "2.4k",
      songs: 48,
      featured: true,
    }],
  allPlaylist: 
     [
    {
      id: 1,
      title: "Late Night Lo-Fi",
      subtitle: "By PlaylistHub Curators",
      image: "/Hero.png",
      likes: "2.4k",
      songs: 48,
      featured: true,
    },
    {
      id: 2,
      title: "Chill Indie Mix",
      subtitle: "By Emily",
      image: "/Hero.png",
      likes: "1.8k",
      songs: 36,
    },
    {
      id: 3,
      title: "Synthwave Drive",
      subtitle: "By Retro Lovers",
      image: "/Hero.png",
      likes: "3.1k",
      songs: 52,
    },
  ]
  
};
 
const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    toggleSave: (state, action: PayloadAction<Playlist>) => {
      const exists = state.saved.find(p => p.id === action.payload.id);

      if (exists) {
        state.saved = state.saved.filter(p => p.id !== action.payload.id);
      } else {
        state.saved.push(action.payload);
      }
    },
    addPlaylist : ((state,action:PayloadAction<Playlist>)=>{
        const exists = state.myPlaylist.find(p => p.id === action.payload.id)
        if(!exists)
            state.myPlaylist.push(action.payload)
    })
  },
});

export const { toggleSave,addPlaylist } = playlistSlice.actions;
export default playlistSlice.reducer;
