export const serializeAuthUser = (user) => ({
  id: String(user._id),
  name: user.username,
  username: user.username,
  email: user.email,
  image: user.image,
  savedPlaylists: user.savedPlaylists ?? [],
  spotifyConnected: Boolean(user.authMethods?.spotify && user.spotify?.accountId),
  spotifyDisplayName: user.spotify?.displayName ?? "",
  spotifyProduct: user.spotify?.product ?? "",
  spotifyAccountId: user.spotify?.accountId ?? "",
});
