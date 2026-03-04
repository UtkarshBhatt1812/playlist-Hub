import jwt from "jsonwebtoken";
import { User } from "../../models/user.model.js";
import ApiError from "../../utils/ApiError.js";
import { getAccessToken, getRefreshToken } from "../../utils/signJwt.js";

 const refreshController = async (req, res) => {
  

  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token required");
  }


  const userid = req.user.id;
  const user = await User.findById(userid);
  if (!user) {
    throw new ApiError(401, "User not found");
  }
  if (user.refreshToken !== refreshToken) {
    throw new ApiError(401, "Invalid refresh token2");
  }


  const newAccessToken = getAccessToken(user);
  const newRefreshToken = getRefreshToken(user);


  user.refreshToken = newRefreshToken;
  await user.save();


  res
    .cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    .status(200)
    .json({
      success: true,
      message: "Token refreshed",
      accessToken: newAccessToken,
    });
};
export default refreshController