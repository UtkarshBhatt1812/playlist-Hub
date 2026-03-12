import cloudinary from "../../services/cloudinary.service.js";
import fs from "fs/promises";
import { Playlist } from "../../models/playlist.model.js";
import ApiError from "../../utils/ApiError.js";
import {User} from "../../models/user.model.js";
const extractSpotifyId = (urlOrId) => {
  if (urlOrId.includes("spotify.com")) {
    return urlOrId.split("/track/")[1]?.split("?")[0];
  }
  return urlOrId;
};

export const createPlaylist = async (req, res) => {
  let uploadedFilePath = null;

  try {

    console.log("body:", req.body);
    console.log("file:", req.file);

    const userId = req.user.id;

    let {
      title,
      description,
      songs = [],
      isPublic = false,
      tags = [],
    } = req.body;

    if (!title) {
      throw new ApiError(400, "Playlist title is required");
    }

    // multipart -> JSON conversion
    if (typeof songs === "string") songs = JSON.parse(songs);
    if (typeof tags === "string") tags = JSON.parse(tags);
    if (typeof isPublic === "string") isPublic = isPublic === "true";

    let imageUrl = null;

    if (req.file) {

      uploadedFilePath = req.file.path;

      const result = await cloudinary.uploader.upload(uploadedFilePath, {
        folder: "playlist_covers",
        transformation: [{ width: 300, height: 300, crop: "fill" }],
      });

      imageUrl = result.secure_url;
    }

    const playlist = await Playlist.create({
      name: title,
      description,
      owner: userId,
      songs,
      isPublic,
      coverImage: imageUrl,
      tags,
      totalLikes: 0,
      likes: [],
    });

    const user = await User.findById(userId);
    if (user) {
      user.myPlaylist.push(playlist._id);
      await user.save();
    }
    res.status(201).json(playlist);

  } catch (error) {

    console.log("error:", error);

    res.status(400).json({
      message: "Failed to create playlist",
      error: error.message,
    });

  } finally {

    if (uploadedFilePath) {
      try {
        await fs.unlink(uploadedFilePath);
      } catch (err) {
        console.log("File deletion error:", err.message);
      }
    }

  }
};

export const getAllPlaylists = async (req, res) => {
  const playlists = await Playlist.find().populate(
    "owner",
    "username email",
  );
  res.json(playlists);
};

export const getPlaylistById = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id).populate(
    "owner",
    "username email",
  );

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  
  res.json(playlist);
}
export const getPublicPlaylists = async (req, res) => {
  const playlists = await Playlist.find({ isPublic: true }).populate(
    "owner",
    "username",
  );
  res.json(playlists);
};

export const getMyPlaylists = async (req, res) => {
  const playlists = await Playlist.find({
    owner: req.user._id,
  });

  res.json(playlists);
};
export const toggleLike = async(req,res)=>{

  const playlist = await Playlist.findById(req.params.id);
  
  if (!playlist) {  
    throw new ApiError(404, "Playlist not found");
  }




 const userId = req.user.id;

const alreadyLiked = playlist.likes.some(
  (id) => id?.toString() === userId
);

if (alreadyLiked) {
  await Playlist.findByIdAndUpdate(
    playlist._id,
    { $pull: { likes: userId } }
    
  );
  playlist.totalLikes -= 1  ;
} else {
  await Playlist.findByIdAndUpdate(
    playlist._id,
    { $addToSet: { likes: userId } }
  );
  playlist.totalLikes += 1  ;
}



  await playlist.save();

  console.log("Playlist after Save : ", playlist);
  res.json(alreadyLiked);
}
export const getSavedPlaylists = async (req, res) => {
  const playlists = await Playlist.find({
    likes: req.user.id,
  });

  res.json(playlists);
};

export const toggleSavePlaylist = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  const userId = req.user._id.toString();

  const alreadySaved = playlist.likes.some((id) => id.toString() === userId);

  if (alreadySaved) {
    playlist.likes = playlist.likes.filter((id) => id.toString() !== userId);
  } else {
    playlist.likes.push(req.user._id);
  }

  playlist.totalLikes = playlist.likes.length;

  await playlist.save();

  res.json(playlist);
};


export const deletePlaylist = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  await playlist.deleteOne();

  res.json({
    message: "Playlist deleted successfully",
  });
};
