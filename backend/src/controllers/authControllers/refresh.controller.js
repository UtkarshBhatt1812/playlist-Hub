import ApiError from "../../utils/ApiError";

const refreshController = async (req,res)=>{


    const {user} = req.body;
    if(!user){
        return ApiError(400, "User information is required");
    }

    const User = await User.findById(user.id);
    if(!User){
        return ApiError(404, "User not found");
    }

    const accessToken = getAccessToken({id : user._id});
    return ApiResponse(200, res, {
        success : true,
        message : "Access token refreshed successfully",
        accessToken
    })
}