 import mongoose from "mongoose";

 const userSchema = mongoose.Schema({
    username : {
        type : String , 
        required : true,
        trim : true
    },
    image : {
        type : String ,
        default : "https://www.flaticon.com/free-icon/user_149071"  ,
        trim : true
    },
    email : {
        type : String , 
        required : true,
        unique : true,
        trim : true
    },
    password : {
        type : String , 
        required : true ,
        minlength : 8,
        select : false
    },
    savedPlaylists : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "Playlist"
    },
    myPlaylist : {
        type : [mongoose.Schema.Types.ObjectId],
        ref : "Playlist"
    },
    songs : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Song"
    }
    ,
    refreshToken : {
        type : String
    }
 },
{timestamps : true}
)

 export const User = mongoose.model("User",userSchema);
