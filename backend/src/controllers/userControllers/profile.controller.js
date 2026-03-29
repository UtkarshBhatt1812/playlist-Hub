import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import fs from "fs/promises";
import { User } from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.js";
import cloudinary from "../../services/cloudinary.service.js";
import { serializeAuthUser } from "../../utils/serializeAuthUser.js";

dotenv.config();

const playlistPopulateOptions = {
  path: "owner",
  select: "username email image",
};

const getRequesterId = (req) => {
  const accessToken = req.cookies?.accessToken;

  if (!accessToken || !process.env.ACCESS_TOKEN_SECRET) {
    return null;
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
      return null;
    }

    return String(decoded.id);
  } catch {
    return null;
  }
};

const buildProfilePayload = (user, requesterId) => {
  const isOwnProfile = Boolean(requesterId && requesterId === user._id.toString());
  const followers = user.followers ?? [];
  const following = user.following ?? [];
  const totalSaves = user.savedPlaylists?.length ?? 0;

  return {
    id: user._id,
    name: user.username,
    username: user.username,
    email: user.email,
    image: user.image,
    followersCount: followers.length,
    followingCount: following.length,
    totalSaves,
    isFollowing: requesterId
      ? followers.some((followerId) => followerId.toString() === requesterId)
      : false,
    isOwnProfile,
    playlists: user.myPlaylist ?? [],
    savedPlaylists: isOwnProfile ? user.savedPlaylists ?? [] : [],
  };
};

export const getCurrentUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "username email image savedPlaylists followers following authMethods spotify",
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        ...serializeAuthUser(user),
        followersCount: user.followers?.length ?? 0,
        followingCount: user.following?.length ?? 0,
        totalSaves: user.savedPlaylists?.length ?? 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserProfileById = async (req, res, next) => {
  try {
    const requesterId = getRequesterId(req);
    const user = await User.findById(req.params.id).select(
      "username email image savedPlaylists myPlaylist followers following",
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const isOwnProfile = Boolean(
      requesterId && requesterId === user._id.toString(),
    );

    await user.populate({
      path: "myPlaylist",
      match: isOwnProfile ? {} : { isPublic: true },
      populate: playlistPopulateOptions,
    });

    if (isOwnProfile) {
      await user.populate({
        path: "savedPlaylists",
        populate: playlistPopulateOptions,
      });
    }

    res.status(200).json({
      success: true,
      profile: buildProfilePayload(user, requesterId),
    });
  } catch (error) {
    next(error);
  }
};

export const toggleFollowUser = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      throw new ApiError(400, "You cannot follow yourself");
    }

    const [currentUser, targetUser] = await Promise.all([
      User.findById(currentUserId).select("following"),
      User.findById(targetUserId).select("followers"),
    ]);

    if (!currentUser || !targetUser) {
      throw new ApiError(404, "User not found");
    }

    const alreadyFollowing = currentUser.following.some(
      (followedUserId) => followedUserId.toString() === targetUserId,
    );

    if (alreadyFollowing) {
      currentUser.following.pull(targetUser._id);
      targetUser.followers.pull(currentUser._id);
    } else {
      currentUser.following.addToSet(targetUser._id);
      targetUser.followers.addToSet(currentUser._id);
    }

    await Promise.all([
      currentUser.save({ validateBeforeSave: false }),
      targetUser.save({ validateBeforeSave: false }),
    ]);

    res.status(200).json({
      success: true,
      userId: targetUserId,
      following: !alreadyFollowing,
      followersCount: targetUser.followers.length,
      followingCount: currentUser.following.length,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfileImage = async (req, res, next) => {
  let uploadedFilePath = null;

  try {
    if (!req.file) {
      throw new ApiError(400, "Profile image is required");
    }

    uploadedFilePath = req.file.path;

    const user = await User.findById(req.user.id).select(
      "username email image savedPlaylists followers following authMethods spotify",
    );

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const result = await cloudinary.uploader.upload(uploadedFilePath, {
      folder: "profile_images",
      transformation: [{ width: 400, height: 400, crop: "fill" }],
    });

    user.image = result.secure_url;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      image: user.image,
      user: {
        ...serializeAuthUser(user),
        followersCount: user.followers?.length ?? 0,
        followingCount: user.following?.length ?? 0,
        totalSaves: user.savedPlaylists?.length ?? 0,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (uploadedFilePath) {
      try {
        await fs.unlink(uploadedFilePath);
      } catch {
        // Ignore temp file cleanup failures.
      }
    }
  }
};
