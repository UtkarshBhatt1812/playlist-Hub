import { useEffect, useState } from "react";
import type { AxiosError } from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { syncAuthenticatedUser } from "@/features/auth/authSession";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  clearStoredSpotifyPkceVerifier,
  getStoredSpotifyPkceVerifier,
} from "@/lib/spotifyAuth";
import api from "@/services/api";

const SpotifyAuthCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const completeSpotifyAuth = async () => {
      const callbackError = searchParams.get("error");
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (callbackError) {
        clearStoredSpotifyPkceVerifier();
        setError(callbackError);
        return;
      }

      try {
        const codeVerifier = getStoredSpotifyPkceVerifier();

        if (!code || !state || !codeVerifier) {
          throw new Error("Spotify PKCE session is incomplete. Start the connection flow again.");
        }

        const response = await api.post<{ returnTo?: string }>("/auth/spotify/exchange", {
          code,
          state,
          codeVerifier,
        });

        clearStoredSpotifyPkceVerifier();
        await syncAuthenticatedUser(dispatch);
        navigate(response.data.returnTo || "/", { replace: true });
      } catch (err) {
        console.error("Failed to finish Spotify authentication:", err);
        const apiError = err as AxiosError<{ message?: string }>;
        setError(
          apiError.response?.data?.message ||
          (err instanceof Error
            ? err.message
            : "Spotify authentication completed, but we could not load your session."),
        );
      }
    };

    void completeSpotifyAuth();
  }, [dispatch, navigate, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#efe9ff] via-[#f6f3ff] to-[#e8f6ff] px-6">
      <div className="w-full max-w-lg rounded-3xl border border-white/50 bg-white/80 p-10 text-center shadow-xl backdrop-blur-xl">
        <h1 className="text-3xl font-bold text-primaryText">
          {error ? "Spotify connection failed" : "Connecting Spotify"}
        </h1>
        <p className="mt-3 text-sm text-secondaryText">
          {error ||
            "Finalizing your Spotify session and preparing playback controls."}
        </p>
      </div>
    </div>
  );
};

export default SpotifyAuthCallbackPage;
