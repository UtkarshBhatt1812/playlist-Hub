 const extractSpotifyId = (urlOrId) => {

  if (urlOrId.includes("spotify.com")) {
    return urlOrId.split("/track/")[1]?.split("?")[0];
  }
  return urlOrId;
};
export const createPlaylist = async (req, res) => {
  const { name, description, songs = [] } = req.body;

  if (!name) {
    throw new ApiError(400, "Playlist name is required");
  }

  const cleanedSongs = songs.map((song) => ({
    spotifyId: extractSpotifyId(song),
  }));

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user._id,
    songs: cleanedSongs,
  });

  return res.status(201).json(
    new ApiResponse(201, "Playlist created successfully", playlist)
  );
};
export const getAllPlaylists = async (req, res) => {
  const playlists = await Playlist.find({ isPublic: true })
    .populate("owner", "username email");

  return res.status(200).json(
    new ApiResponse(200, "Playlists fetched", playlists)
  );
};
export const likePlaylist = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.likes.includes(req.user._id)) {
    throw new ApiError(400, "Already liked");
  }

  playlist.likes.push(req.user._id);
  playlist.totalLikes = playlist.likes.length;

  await playlist.save();

  return res.status(200).json(
    new ApiResponse(200, "Playlist liked", { totalLikes: playlist.totalLikes })
  );
};
export const unlikePlaylist = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  playlist.likes = playlist.likes.filter(
    (id) => id.toString() !== req.user._id.toString()
  );

  playlist.totalLikes = playlist.likes.length;

  await playlist.save();

  return res.status(200).json(
    new ApiResponse(200, "Playlist unliked")
  );
};
export const deletePlaylist = async (req, res) => {
  const playlist = await Playlist.findById(req.params.id);

  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized");
  }

  await playlist.deleteOne();

  return res.status(200).json(
    new ApiResponse(200, "Playlist deleted successfully")
  );
};
export const getMyPlaylists = async (req, res) => {
  const playlists = await Playlist.find({
    owner: req.user._id,
  });

  return res.status(200).json(
    new ApiResponse(200, "Your playlists fetched", playlists)
  );
};