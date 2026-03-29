export interface AuthState {
  user: {
    id: string;
    name: string;
    image: string;
    isAuthenticated: boolean;
    savedPlaylists: string[];
    spotifyConnected: boolean;
    spotifyDisplayName: string;
    spotifyProduct: string;
    spotifyAccountId: string;
  };
  loading: boolean;
}
