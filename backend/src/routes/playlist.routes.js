import express from "express";
import {
  createPlaylist,
  getAllPlaylists,
  likePlaylist,
  unlikePlaylist,
  
} from "../controllers/playlistControllers/playlist.controller.js";

import  verifyJWT  from "../middlewares/authMiddleware.js";

const router = express.Router();
router.get("/", getAllPlaylists);
// router.get("/:id", getSinglePlaylist);
// router.get("/me/mine", verifyJWT, getMyPlaylists);
router.post("/", verifyJWT, createPlaylist);

// if i want to allow directly update playlist  then i can use patch method, but for now we will keep it simple and not allow update playlist
// router.patch("/:id", verifyJWT, updatePlaylist);
// router.delete("/:id", verifyJWT, deletePlaylist);

router.post("/:id/like", verifyJWT, likePlaylist);
router.post("/:id/unlike", verifyJWT, unlikePlaylist);

export default router;
