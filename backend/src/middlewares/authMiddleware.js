import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ApiError from "../utils/ApiError.js";

dotenv.config();

const authMiddleware = async (req, res, next) => {


  if (!req.cookies || !req.cookies.accessToken) {
    return next(new ApiError(401, "Unauthorized: No token provided"));
  }
  

  try {
    const token = req.cookies.accessToken;
    const decoded =  await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      return next(new ApiError(401, "Unauthorized: Invalid token"));
    }
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ApiError(401, "Unauthorized: Invalid token"));
  }
};

export default authMiddleware;
