import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const optionalAuthMiddleware = async (req, res, next) => {
  void res;

  const token = req.cookies?.accessToken;

  if (!token || !process.env.ACCESS_TOKEN_SECRET) {
    return next();
  }

  try {
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decoded) {
      req.user = decoded;
    }
  } catch {
    // Ignore invalid tokens for optional auth flows.
  }

  next();
};

export default optionalAuthMiddleware;
