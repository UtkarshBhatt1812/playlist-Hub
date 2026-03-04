import {User} from "../../models/user.model.js";
import ApiResponse from "../../utils/ApiResonse.js";
 const logoutHandler = async (req, res) => {
   const id =  req.user.id
   console.log("this is  : " , req.user)
    if (!id) {
        return res.status(401).json({ message: "No user Found" });
    }
    const user = await User.findById(id);
    console.log("user", user)
    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
    console.log("user after save : ", user)

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
    });
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
}
export default logoutHandler