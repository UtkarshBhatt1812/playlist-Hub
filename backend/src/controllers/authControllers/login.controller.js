import { mongo } from "mongoose";
import ApiError from "../../utils/ApiError";
import { User } from "../../models/user.model";
import bcrypt from "bcryptjs";
import { getAccessToken, getRefreshToken } from "../../utils/signJWT";

// key define krni h 

const loginController = async (req, res) => {
    const {email , username ,password} = req.body;
    if(!email && !username ){
        return ApiError(400, "Email or username is required");
    }
    if(!password){
        return ApiError(400, "Password is required");
    }
    const user = await User.findOne({
        $or: [
            { email: email },
            { username: username }
        ]
    })
    .select("+password")
    
    if(!user){

        return ApiError(404, "User not found");

    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if(!isCorrect ){
        return ApiError(401, "Invalid credentials");
    }
    
    // generate token and refresh token

    const accessToken = getAccessToken({id : user._id});
    const refreshToken = getRefreshToken({id : user._id});

    
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
        httpOnly : true,
        secure : false,
        sameSite : "strict",
        maxAge : 15 * 60 * 1000
    })
    res.status(200).json({
        success : true,
        message : "Login successful",
        accessToken
    })

}
export default loginController;