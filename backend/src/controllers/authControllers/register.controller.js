import bcrypt from "bcryptjs";
import { User } from "../../models/user.model.js";
import ApiResponse from "../../utils/ApiResonse.js";
import { getAccessToken, getRefreshToken } from "../../utils/signJWT.js";

const registerController = async (req, res) => {
  const { username, email, password } = req.body;

  const trimmedUsername = username?.trim();
  const trimmedEmail = email?.trim().toLowerCase();

  if (!trimmedUsername || !trimmedEmail || !password) {
    return res.status(400).json(
      new ApiResponse(400, "Username, email and password are required")
    );
  }

  const emailRegex = /\S+@\S+\.\S+/;

  if (!emailRegex.test(trimmedEmail)) {
    return res.status(400).json(
      new ApiResponse(400, "Invalid email format")
    );
  }

  if (password.length < 8) {
    return res.status(400).json(
      new ApiResponse(400, "Password must be at least 8 characters")
    );
  }

  const isExists = await User.findOne({
    $or: [{ email: trimmedEmail }, { username: trimmedUsername }],
  });

  if (isExists) {
    return res.status(400).json(
      new ApiResponse(
        400,
        "User with given email or username already exists"
      )
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username: trimmedUsername,
    email: trimmedEmail,
    password: hashedPassword,
  });

  const accessToken = getAccessToken(user);
  const refreshToken = getRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(201)
    .json(
      new ApiResponse(201, "User registered successfully", {
        id: user._id,
        username: user.username,
        email: user.email,
        image:user.coverImage
      })
    );
};

export default registerController;