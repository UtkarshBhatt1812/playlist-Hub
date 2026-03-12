import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();


if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("JWT secrets are not defined in environment variables");
}

const getAccessToken = (user) => {
    const payload = {
        id : user._id,
        email : user.email,
        name : user.username,
        image : user.image
    }
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn : process.env.ACCESS_TOKEN_EXPIRY});
}
const getRefreshToken = (user) =>{
    const payload = {
        userid : user._id
    }
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn : process.env.REFRESH_TOKEN_EXPIRY});
}

export {getAccessToken, getRefreshToken};