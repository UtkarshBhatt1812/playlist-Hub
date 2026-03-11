import { setUser } from "@/features/auth/authSlice";
import Router from "./router";
import api from "@/services/api";
import { useEffect } from "react";
import { useAppDispatch } from "@/hooks/useAppDispatch";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const refreshAuth = async () => {
      try {
        await api.post("/auth/refresh");
        const user = await api.get("/users/profile");
        dispatch(setUser(user.data));
      } catch (err) {
        console.log("User not logged in", err);
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
  }, []);
  return <Router />;
}

export default App;
