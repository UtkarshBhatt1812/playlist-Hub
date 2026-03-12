export interface Playlist {
  title: string;
  description: string;
  image: string|null;
  imageFile : File |null
  likes?: string[];     
  songs?: string[];
  tags ?: string[];
  featured?: boolean;
  visibility : string;
  totalLikes ?: number;
}
export interface BackendPlaylist {
  _id: string;
  name: string;
  description: string;
  coverImage: string | null;
  isPublic: boolean;

  owner: {
    _id: string;
    username: string;
  };

  songs: string[];

  tags: string[];

  likes: string[];

  totalLikes: number;

  createdAt: string;
  updatedAt: string;

  __v: number;
}
