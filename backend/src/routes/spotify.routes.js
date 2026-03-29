import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { getFrontendSpotifyAccessToken } from "../controllers/authControllers/spotify.controller.js";

const router = express.Router();

router.get("/access-token", authMiddleware, getFrontendSpotifyAccessToken);

export default router;
