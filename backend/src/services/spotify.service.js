import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
let spotifyToken = null;
let tokenExpiry = 0;



if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  console.error("Missing Credentials");
  process.exit(1);
}

export const getSpotifyToken = async () => {
  try {
    
    //1hr valid rehta h so cache implement krna h 
    if (spotifyToken && Date.now() < tokenExpiry){
      return spotifyToken;
    }

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "client_credentials",
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        auth: {
          username: process.env.SPOTIFY_CLIENT_ID ,
          password: process.env.SPOTIFY_CLIENT_SECRET,
        },
      }
    );

    spotifyToken = response.data.access_token;
    tokenExpiry = Date.now() + (response.data.expires_in - 60) * 1000;

    return spotifyToken;
  } catch (err) {
    console.error("Token Error:", err.response?.data || err.message);
    throw new Error("Failed to get Spotify token");
  }
};

