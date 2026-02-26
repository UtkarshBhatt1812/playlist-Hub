const extractSpotifyId = (urlOrId) => {

  if (urlOrId.includes("spotify.com")) {
    return urlOrId.split("/track/")[1]?.split("?")[0];
  }
  return urlOrId;
};