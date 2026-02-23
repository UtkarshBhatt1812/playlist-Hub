import { Routes, Route } from "react-router-dom";
import AppLayout from "./AppLayout";
import AuthLayout from "./AuthLayout";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import Home from "@/pages/home";
import Explore from "@/pages/ExploreGeneres";
import PlaylistDetails from "@/pages/PlaylistPage";
import Profile from "@/pages/ProfilePage";
import CreatePlaylist from "@/pages/SharePage";
import Login from "@/pages/LoginPage";
import Signup from "@/pages/SignupPage";
import NotFound from "@/pages/NotFound";
import SavedPlaylist from "@/pages/SavedPlaylist";
import MyPlaylistsPage from "@/pages/MyPlaylistPage";
import SavedSongsPage from "@/pages/SavedSongsPage";

const Router = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/saved" element={<SavedPlaylist />} />
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/playlist/:id" element={<PlaylistDetails />} />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
          
        />
        <Route path="/my-playlists" element={

           <ProtectedRoute>
              <MyPlaylistsPage />
            </ProtectedRoute>
          
        } />
      </Route>
      <Route path="/create" element={
        <ProtectedRoute><CreatePlaylist /></ProtectedRoute> }
        />
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/signup"
          element={
            //todo:suspense and lazy loading for login and signup page
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
      </Route>
          <Route path="/saved-songs" element={
            <ProtectedRoute><SavedSongsPage /></ProtectedRoute>
          } />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
