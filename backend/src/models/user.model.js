 import mongoose from "mongoose";

 const userSchema = mongoose.Schema({
    name : {
        type : String , 
        required : true,
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
    playlist : {
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
