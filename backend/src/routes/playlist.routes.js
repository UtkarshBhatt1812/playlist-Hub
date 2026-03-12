import express from "express";
import {
  createPlaylist,
  getPlaylistById,
  getPublicPlaylists,
  toggleLike,
} from "../controllers/playlistControllers/playlist.controller.js";

import  verifyJWT  from "../middlewares/authMiddleware.js";

import upload from "../middlewares/multer.middleware.js";

const router = express.Router();
router.get("/fetchPublic", getPublicPlaylists);
router.get("/:id", getPlaylistById);
// router.get('/:id/tracks',getPlaylistTracks);
// router.get("/me", verifyJWT, getMyPlaylists);
router.post("/", verifyJWT,upload.single("image") ,createPlaylist);


// if i want to allow directly update playlist  then i can use patch method, but for now we will keep it simple and not allow update playlist
// router.patch("/:id", verifyJWT, updatePlaylist);
// router.delete("/:id", verifyJWT, deletePlaylist);
router.post("/:id/togglelike", verifyJWT, toggleLike);
// router.post("/:id/toggleSave", verifyJWT, toggleSave);








export default router;
