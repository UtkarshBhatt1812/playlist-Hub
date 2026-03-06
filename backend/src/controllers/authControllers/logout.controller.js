import {User} from "../../models/user.model.js";
import ApiResponse from "../../utils/ApiResonse.js";
 const logoutHandler = async (req, res) => {
   const id =  req.user.id

    if (!id) {
        return res.status(401).json({ message: "No user Found" });
    }
    const user = await User.findById(id);

    if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });


    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
    });
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
    });
    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
}
export default logoutHandler