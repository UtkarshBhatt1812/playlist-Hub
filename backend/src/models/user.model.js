 import mongoose from "mongoose";
import { songSchema } from "./song.schema.js";

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
        required : function requiredPassword() {
          return this.authMethods?.local;
        },
        minlength : 8,
        select : false
    },
    authMethods: {
      type: new mongoose.Schema(
        {
          local: {
            type: Boolean,
            default: true,
          },
          spotify: {
            type: Boolean,
            default: false,
          },
        },
        { _id: false },
      ),
      default: () => ({
        local: true,
        spotify: false,
      }),
    },
    savedPlaylists : {
        type : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Playlist"
        }],
        default : []
    },
    myPlaylist : {
        type : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "Playlist"
        }],
        default : []
    },
    followers : {
        type : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }],
        default : []
    },
    following : {
        type : [{
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }],
        default : []
    },
    songs: {
      type: [songSchema],
      default: []
    },
    spotify: {
      type: new mongoose.Schema(
        {
          accountId: {
            type: String,
            default: "",
            trim: true,
          },
          displayName: {
            type: String,
            default: "",
            trim: true,
          },
          email: {
            type: String,
            default: "",
            trim: true,
          },
          product: {
            type: String,
            default: "",
            trim: true,
          },
          country: {
            type: String,
            default: "",
            trim: true,
          },
          refreshToken: {
            type: String,
            default: "",
          },
          accessToken: {
            type: String,
            default: "",
          },
          accessTokenExpiresAt: {
            type: Date,
            default: null,
          },
        },
        { _id: false },
      ),
      default: () => ({
        accountId: "",
        displayName: "",
        email: "",
        product: "",
        country: "",
        refreshToken: "",
        accessToken: "",
        accessTokenExpiresAt: null,
      }),
    },
    refreshToken : {
        type : String
    }
 },
{timestamps : true}
)

 export const User = mongoose.model("User",userSchema);
