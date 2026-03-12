import express from "express";
import  authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {

  res.status(200).json({
    success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        image: req.user.image,
      },
  });
});

// router.get("/:id/playlists", authMiddleware, getUserPlaylists);

export default router;