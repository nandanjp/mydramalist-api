export const BASE_ENDPOINT = "https://api.spotify.com/v1" as const;

export const GET_TRACK_ENDPOINT = `${BASE_ENDPOINT}/tracks` as const;
export const GET_ALBUM_ENDPOINT = `${BASE_ENDPOINT}/albums` as const;
export const GET_ARTIST_ENDPOINT = `${BASE_ENDPOINT}/artists` as const;
