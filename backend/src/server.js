import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


// ✅ check env variables

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  console.error("Missing Spotify credentials in .env");
  process.exit(1);
}


// ✅ Token cache
let spotifyToken = null;
let tokenExpiry = 0;


// 🔹 Get Spotify Token (with caching)
const getSpotifyToken = async () => {
  try {
    
    // if token still valid → reuse
    if (spotifyToken && Date.now() < tokenExpiry) {
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
    tokenExpiry = Date.now() + response.data.expires_in * 1000;

    return spotifyToken;
  } catch (err) {
    console.error("Token Error:", err.response?.data || err.message);
    throw new Error("Failed to get Spotify token");
  }
};



app.get("/album/:id", async (req, res) => {
  try {
    const token = await getSpotifyToken();
    const albumId = req.params.id;
    console.log(token)
    const response = await axios.get(
      `https://api.spotify.com/v1/albums/${albumId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Spotify API Error:", error.response?.data || error.message);

    res.status(error.response?.status || 500).json({
      message: "Error fetching album",
      error: error.response?.data || error.message,
    });
  }
});



app.get("/", (req, res) => {
  res.send("Spotify API Server Running 🚀");
});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
