import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type AuthState } from "./auth.types";
import { toggleSavePlaylist } from "../playlist/playlistThunks";

const initialState: AuthState = {
  user: {
    id: "",
    name: "",
    image: "",
    isAuthenticated: false,
    savedPlaylists: [],
    spotifyConnected: false,
    spotifyDisplayName: "",
    spotifyProduct: "",
    spotifyAccountId: "",
  },
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },

    setUser(
      state,
      action: PayloadAction<{
        id: string;
        name: string;
        image?: string;
        isAuthenticated: boolean;
        savedPlaylists?: string[];
        spotifyConnected?: boolean;
        spotifyDisplayName?: string;
        spotifyProduct?: string;
        spotifyAccountId?: string;
      }>
    ) 
    {
      state.user = {
        id: action.payload.id,
        name: action.payload.name,
        image: action.payload.image ?? "",
        isAuthenticated: action.payload.isAuthenticated ,
        savedPlaylists: action.payload.savedPlaylists ?? [],
        spotifyConnected: action.payload.spotifyConnected ?? false,
        spotifyDisplayName: action.payload.spotifyDisplayName ?? "",
        spotifyProduct: action.payload.spotifyProduct ?? "",
        spotifyAccountId: action.payload.spotifyAccountId ?? "",
      } ;
      state.loading = false;
    },

    setUserImage(state, action: PayloadAction<string>) {
      state.user.image = action.payload;
    },

    logout(state) {
      state.user.id = "";
      state.user.name = "";
      state.user.image = "";
      state.user.isAuthenticated = false;
      state.user.savedPlaylists = [];
      state.user.spotifyConnected = false;
      state.user.spotifyDisplayName = "";
      state.user.spotifyProduct = "";
      state.user.spotifyAccountId = "";
      state.loading = false;
    },

  },
  extraReducers: (builder) => {
    builder.addCase(toggleSavePlaylist.fulfilled, (state, action) => {
      const { playlistId, saved } = action.payload;

      if (saved) {
        if (!state.user.savedPlaylists.includes(playlistId)) {
          state.user.savedPlaylists.push(playlistId);
        }

        return;
      }

      state.user.savedPlaylists = state.user.savedPlaylists.filter(
        (savedPlaylistId) => savedPlaylistId !== playlistId,
      );
    });
  },
});

export const { setLoading, setUser, setUserImage, logout } = authSlice.actions;

export default authSlice.reducer;
