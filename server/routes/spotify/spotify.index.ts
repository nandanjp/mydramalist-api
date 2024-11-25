import { createRouter } from "@/lib/create-app";
import * as handlers from "./spotify.handlers";
import * as routes from "./spotify.routes";
import { spotifyApi } from "@/middleware/redis/spotify-store";

export default createRouter()
    .openapi(routes.getTrackById, handlers.getTrackById)
    .openapi(routes.getArtistById, handlers.getArtistById)
    .openapi(routes.getAlbumById, handlers.getAlbumById)
    .openapi(routes.getPlaylistById, handlers.getPlaylistById)
    .openapi(routes.getArtistTracks, handlers.getArtistTracks)
    .openapi(routes.getArtistTopTracks, handlers.getArtistTopTracks)
    .openapi(routes.getAllTracks, handlers.getAllTracks)
    .openapi(routes.getAllAlbums, handlers.getAllAlbums)
    .openapi(routes.getAllArtists, handlers.getAllArtists)
    .use(spotifyApi);
