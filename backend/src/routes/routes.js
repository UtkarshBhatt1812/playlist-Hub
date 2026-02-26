import express from "express";
import { getPlaylist } from "../controllers/getPlaylist.js";
let routes = express.Router();

routes.get('/featured-playlist', getPlaylist);

export default routes;