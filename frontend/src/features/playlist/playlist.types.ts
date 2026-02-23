export interface Playlist {
  id: number;
  title: string;
  subtitle: string;
  image: string;
    likes?: string;     
    songs?: number;
    featured?: boolean;
}

export interface PlaylistState {
  saved: Playlist[];
  allPlaylist: Playlist[];
  myPlaylist: Playlist[];
}
