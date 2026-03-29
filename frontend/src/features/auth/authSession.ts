import type { AppDispatch } from "@/app/store";
import { logout, setUser } from "./authSlice";
import api from "@/services/api";

type CurrentUserResponse = {
  user: {
    id: string;
    name: string;
    username?: string;
    image?: string;
    savedPlaylists?: string[];
    spotifyConnected?: boolean;
    spotifyDisplayName?: string;
    spotifyProduct?: string;
    spotifyAccountId?: string;
  };
};

type SpotifyStatusResponse = {
  connected: boolean;
  displayName?: string;
  product?: string;
  accountId?: string;
};

export const syncAuthenticatedUser = async (dispatch: AppDispatch) => {
  const profileResponse = await api.get<CurrentUserResponse>("/users/profile");
  let spotifyStatus: SpotifyStatusResponse | null = null;

  try {
    const statusResponse = await api.get<SpotifyStatusResponse>("/auth/spotify/status");
    spotifyStatus = statusResponse.data;
  } catch {
    spotifyStatus = null;
  }

  const user = profileResponse.data.user;

  dispatch(
    setUser({
      id: user.id,
      name: user.username || user.name,
      image: user.image ?? "",
      isAuthenticated: true,
      savedPlaylists: user.savedPlaylists ?? [],
      spotifyConnected: spotifyStatus?.connected ?? user.spotifyConnected ?? false,
      spotifyDisplayName:
        spotifyStatus?.displayName ?? user.spotifyDisplayName ?? "",
      spotifyProduct: spotifyStatus?.product ?? user.spotifyProduct ?? "",
      spotifyAccountId: spotifyStatus?.accountId ?? user.spotifyAccountId ?? "",
    }),
  );

  return profileResponse.data.user;
};

export const clearAuthenticatedUser = (dispatch: AppDispatch) => {
  dispatch(logout());
};
