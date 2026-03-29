export {};

declare global {
  interface Window {
    Spotify?: {
      Player: new (options: Spotify.PlayerInit) => Spotify.Player;
    };
    onSpotifyWebPlaybackSDKReady?: () => void;
  }

  namespace Spotify {
    interface PlayerInit {
      name: string;
      getOAuthToken: (callback: (token: string) => void) => void;
      volume?: number;
    }

    interface Error {
      message: string;
    }

    interface ReadyPayload {
      device_id: string;
    }

    interface Artist {
      name: string;
    }

    interface AlbumImage {
      url: string;
    }

    interface Album {
      name: string;
      images: AlbumImage[];
    }

    interface Track {
      id: string;
      uri: string;
      name: string;
      duration_ms: number;
      album: Album;
      artists: Artist[];
    }

    interface PlaybackState {
      paused: boolean;
      position: number;
      duration: number;
      repeat_mode: 0 | 1 | 2;
      shuffle: boolean;
      track_window: {
        current_track: Track;
      };
    }

    interface Player {
      connect: () => Promise<boolean>;
      disconnect: () => void;
      addListener: (event: string, listener: (...args: any[]) => void) => boolean;
      removeListener: (event: string, listener?: (...args: any[]) => void) => boolean;
      getCurrentState: () => Promise<PlaybackState | null>;
      getVolume: () => Promise<number>;
      setVolume: (volume: number) => Promise<void>;
      togglePlay: () => Promise<void>;
      nextTrack: () => Promise<void>;
      previousTrack: () => Promise<void>;
      seek: (positionMs: number) => Promise<void>;
    }
  }
}
