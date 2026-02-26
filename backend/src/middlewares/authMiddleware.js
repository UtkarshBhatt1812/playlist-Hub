
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import ApiError from "../utils/ApiError";
dotenv.config();

const authMiddleware = (req, res, next) => {

const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith("Bearer ")) {
  return ApiError(401, 'Unauthorized: No token provided');
}
try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    if(!decoded){
       throw new ApiError(401, 'Unauthorized: Invalid token');
    }
    req.user = decoded;
    next();
} catch (error) {
    next(new ApiError(401, 'Unauthorized: Invalid token'));
}

}
export default authMiddleware;