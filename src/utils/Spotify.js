const clientId = "d4f52131bc314bb1866aa74e869ab1ba";
const redirectUri = "https://omerspotify.netlify.app";
let accessToken;

const Spotify = {
  getAccessToken() {
    if (accessToken) return accessToken;

    const accessTokenMatch = window.location.hash.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.hash.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
      window.history.pushState("Access Token", null, "/");
      return accessToken;
    } else {
      const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = url;
    }
  },

  search(term) {
    const token = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {Authorization: `Bearer ${token}`},
    })
      .then((response) => response.json())
      .then((json) => {
        if (!json.tracks) return [];
        return json.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
      });
  },

  savePlaylist(name, trackUris) {
    if (!name || !trackUris.length) return;

    const token = Spotify.getAccessToken();
    let userId;

    return fetch("https://api.spotify.com/v1/me", {
      headers: {Authorization: `Bearer ${token}`},
    })
      .then((response) => response.json())
      .then((json) => {
        userId = json.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({name}),
        });
      })
      .then((response) => response.json())
      .then((json) => {
        const playlistId = json.id;
        return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({uris: trackUris}),
        });
      });
  },
};

export default Spotify;
