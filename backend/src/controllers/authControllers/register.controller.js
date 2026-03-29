import bcrypt from "bcryptjs";
import { User } from "../../models/user.model.js";
import ApiResponse from "../../utils/ApiResonse.js";
import { getAccessToken, getRefreshToken } from "../../utils/signJwt.js";
import { setAuthCookies } from "../../utils/authCookies.js";
import { serializeAuthUser } from "../../utils/serializeAuthUser.js";

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
    authMethods: {
      local: true,
      spotify: false,
    },
  });

  const accessToken = getAccessToken(user);
  const refreshToken = getRefreshToken(user);

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  setAuthCookies(res, accessToken, refreshToken)
    .status(201)
    .json(
      new ApiResponse(201, "User registered successfully", {
        ...serializeAuthUser(user),
      })
    );
};

export default registerController;
