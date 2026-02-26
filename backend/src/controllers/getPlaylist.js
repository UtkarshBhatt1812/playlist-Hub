import { apiSpotify } from "../api/apiSpotify.js";
import { getSpotifyToken } from "../services/spotify.service.js";

export const getPlaylist = async (req,res) =>{
        try {
            const token = await getSpotifyToken();
            const response = await apiSpotify.get(
                "/search?q=top&type=playlist&limit=10",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            res.json(response.data);
        } catch (error) {
            res.status(error.response?.status || 500).json({ error: error.message });
        }
}