const defaultApiBaseUrl = "http://127.0.0.1:3000";

export const BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.trim() ||
  defaultApiBaseUrl;
