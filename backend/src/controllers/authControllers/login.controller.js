import { mongo } from "mongoose";
import  ApiError from "../../utils/ApiError.js"
import { User } from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import { getAccessToken, getRefreshToken } from "../../utils/signJwt.js";

// key define krni h 

const loginController = async (req, res) => {
    const {email , username ,password} = req.body;
    if(!email && !username ){
        return new ApiError(400, "Email or username is required");
    }
    if(!password){
        return new ApiError(400, "Password is required");
    }
    const user = await User.findOne({
        $or: [
            { email: email },
            { username: username }
        ]
    })
    .select("+password")
    
    if(!user){

        return new ApiError(404, "User not found");

    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if(!isCorrect ){
        return new ApiError(401, "Invalid credentials");
    }
    
    // generate token and refresh token

    const accessToken = getAccessToken(user);
    const refreshToken = getRefreshToken(user);

    
    user.refreshToken = refreshToken;
    await user.save();
    console.log("Login User : ",user)
    res.cookie("accessToken", accessToken, {
        httpOnly : true,
        secure : false,
        sameSite : "strict",
        maxAge : 15 * 60 * 1000
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly : true,
        secure : false,
        sameSite : "strict",
        maxAge : 7*24 *60 * 60 * 1000
    })
    res.status(200).json({
        success : true,
        message : "Login successful",
        accessToken
    })

}
export default loginController;