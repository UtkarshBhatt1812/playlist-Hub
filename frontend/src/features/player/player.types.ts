export type PlayerSdkStatus = "idle" | "loading" | "ready" | "unsupported" | "error";
export type PlayerConnectionStatus =
  | "disconnected"
  | "connecting"
  | "connected";
export type PlayerRepeatMode = "off" | "context" | "track";

export interface PlayerTrack {
  spotifyId: string;
  uri: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  durationMs: number;
}

export interface PlaybackRequestMeta {
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

export interface PlaybackRequest {
  uris: string[];
  fallbackUrl: string;
  meta: PlaybackRequestMeta;
}

export interface PlayerState {
  sdkStatus: PlayerSdkStatus;
  connectionStatus: PlayerConnectionStatus;
  deviceId: string | null;
  error: string | null;
  currentTrack: PlayerTrack | null;
  isPlaying: boolean;
  positionMs: number;
  durationMs: number;
  volume: number;
  shuffle: boolean;
  repeatMode: PlayerRepeatMode;
  pendingPlayback: PlaybackRequest | null;
  lastRequestedPlayback: PlaybackRequest | null;
  mobileFallbackUrl: string | null;
  mobileFallbackMeta: PlaybackRequestMeta | null;
}
