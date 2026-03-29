import express from "express";
import registerHandler from "../controllers/authControllers/register.controller.js";
import  loginHandler from "../controllers/authControllers/login.controller.js";
import  refreshHandler from "../controllers/authControllers/refresh.controller.js";
import  logoutHandler from "../controllers/authControllers/logout.controller.js";
import optionalAuthMiddleware from "../middlewares/optionalAuthMiddleware.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  exchangeSpotifyAuthCode,
  getSpotifyStatus,
  handleSpotifyCallback,
  startSpotifyAuth,
  unlinkSpotifyAccount,
} from "../controllers/authControllers/spotify.controller.js";


const router = express.Router();

router.post("/register", registerHandler);
router.post("/login", loginHandler);
router.post("/refresh", refreshHandler);
router.post("/logout", logoutHandler);
router.get("/spotify/start", optionalAuthMiddleware, startSpotifyAuth);
router.post("/spotify/exchange", exchangeSpotifyAuthCode);
router.get("/spotify/callback", handleSpotifyCallback);
router.get("/spotify/status", authMiddleware, getSpotifyStatus);
router.post("/spotify/unlink", authMiddleware, unlinkSpotifyAccount);

export default router;
