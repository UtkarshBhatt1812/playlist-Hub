
import  ApiError from "../../utils/ApiError.js"
import { User } from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import { getAccessToken, getRefreshToken } from "../../utils/signJwt.js";
import { setAuthCookies } from "../../utils/authCookies.js";
import { serializeAuthUser } from "../../utils/serializeAuthUser.js";

// key define krni h 

const loginController = async (req, res) => {
    const {email , username ,password} = req.body;

    if(!email && !username ){
        throw new ApiError(400, "Email or username is required");
    }
    if(!password){
        throw new ApiError(400, "Password is required");
    }
    const user = await User.findOne({
        $or: [
            { email: email },
            { username: username }
        ]
    })
    .select("+password")


    if(!user){

        throw new ApiError(404, "User not found");

    }

    if (user.authMethods?.local === false || !user.password) {
        throw new ApiError(400, "This account uses Spotify sign in. Please continue with Spotify.");
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if(!isCorrect ){
        throw new ApiError(401, "Invalid credentials");
    }
    
    // generate token and refresh token


    const accessToken = getAccessToken(user);
    const refreshToken = getRefreshToken(user);

    
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    console.log("Login User : ",user)
    setAuthCookies(res, accessToken, refreshToken).status(200).json({
        success : true,
        message : "Login successful",
        user : serializeAuthUser(user)
    })

}
export default loginController;
