import { clearAuthenticatedUser, syncAuthenticatedUser } from "@/features/auth/authSession";
import Router from "./router";
import api from "@/services/api";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import SpotifyPlayerBootstrap from "@/components/Miniplayer/SpotifyPlayerBootstrap";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const refreshAuth = async () => {
      try {
        await api.post("/auth/refresh");
        await syncAuthenticatedUser(dispatch);
      } catch (err) {
        console.log("User not logged in", err);
        clearAuthenticatedUser(dispatch);
      }
    };

    refreshAuth();

    const silentRefresh = async () => {
      try {
        await api.post("/auth/refresh");
      } catch (err) {
        console.log("Silent refresh failed", err);
      }
    };

    const interval = setInterval(silentRefresh, 12 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <>
      <SpotifyPlayerBootstrap />
      <Router />
    </>
  );
}

export default App;
