import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  PlaybackRequest,
  PlaybackRequestMeta,
  PlayerConnectionStatus,
  PlayerRepeatMode,
  PlayerSdkStatus,
  PlayerState,
  PlayerTrack,
} from "./player.types";

const initialState: PlayerState = {
  sdkStatus: "idle",
  connectionStatus: "disconnected",
  deviceId: null,
  error: null,
  currentTrack: null,
  isPlaying: false,
  positionMs: 0,
  durationMs: 0,
  volume: 70,
  shuffle: false,
  repeatMode: "off",
  pendingPlayback: null,
  lastRequestedPlayback: null,
  mobileFallbackUrl: null,
  mobileFallbackMeta: null,
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    resetPlayerState: () => initialState,
    setSdkStatus(state, action: PayloadAction<PlayerSdkStatus>) {
      state.sdkStatus = action.payload;
    },
    setConnectionStatus(state, action: PayloadAction<PlayerConnectionStatus>) {
      state.connectionStatus = action.payload;
    },
    setDeviceId(state, action: PayloadAction<string | null>) {
      state.deviceId = action.payload;
    },
    setPlayerError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    clearPlayerError(state) {
      state.error = null;
    },
    setPlaybackState(
      state,
      action: PayloadAction<{
        currentTrack: PlayerTrack | null;
        isPlaying: boolean;
        positionMs: number;
        durationMs: number;
        shuffle: boolean;
        repeatMode: PlayerRepeatMode;
      }>,
    ) {
      state.currentTrack = action.payload.currentTrack;
      state.isPlaying = action.payload.isPlaying;
      state.positionMs = action.payload.positionMs;
      state.durationMs = action.payload.durationMs;
      state.shuffle = action.payload.shuffle;
      state.repeatMode = action.payload.repeatMode;
    },
    setPositionMs(state, action: PayloadAction<number>) {
      state.positionMs = action.payload;
    },
    setVolume(state, action: PayloadAction<number>) {
      state.volume = action.payload;
    },
    queuePlayback(state, action: PayloadAction<PlaybackRequest>) {
      state.pendingPlayback = action.payload;
      state.lastRequestedPlayback = action.payload;
      state.mobileFallbackUrl = action.payload.fallbackUrl;
      state.mobileFallbackMeta = action.payload.meta;
    },
    clearPendingPlayback(state) {
      state.pendingPlayback = null;
    },
    setMobileFallback(
      state,
      action: PayloadAction<{ url: string | null; meta: PlaybackRequestMeta | null }>,
    ) {
      state.mobileFallbackUrl = action.payload.url;
      state.mobileFallbackMeta = action.payload.meta;
    },
    clearMobileFallback(state) {
      state.mobileFallbackUrl = null;
      state.mobileFallbackMeta = null;
    },
  },
});

export const {
  clearMobileFallback,
  clearPendingPlayback,
  clearPlayerError,
  queuePlayback,
  resetPlayerState,
  setConnectionStatus,
  setDeviceId,
  setMobileFallback,
  setPlaybackState,
  setPlayerError,
  setPositionMs,
  setSdkStatus,
  setVolume,
} = playerSlice.actions;

export default playerSlice.reducer;
