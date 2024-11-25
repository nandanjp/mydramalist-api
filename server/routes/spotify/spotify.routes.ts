import { notFoundSchema } from "@/lib/constants";
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";
import {
    albumSelectSchema,
    artistSelectSchema,
    artistTracksSchema,
    playlistSelectSchema,
    trackSelectSchema,
} from "./spotify.queries";

const tags = ["spotify"];
export const getTrackById = createRoute({
    path: "/spotify/track/{id}",
    method: "get",
    tags,
    request: {
        params: z.object({
            id: z.string(),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(trackSelectSchema, "spotify track"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            notFoundSchema,
            "spotify track not found"
        ),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
            createErrorSchema(IdParamsSchema),
            "Invalid spotify track id error"
        ),
    },
});

export const getAlbumById = createRoute({
    path: "/spotify/album/{id}",
    method: "get",
    tags,
    request: {
        params: z.object({
            id: z.string(),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(albumSelectSchema, "spotify album"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            notFoundSchema,
            "spotify album not found"
        ),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
            createErrorSchema(IdParamsSchema),
            "Invalid spotify album id error"
        ),
    },
});
export const getArtistById = createRoute({
    path: "/spotify/artist/{id}",
    method: "get",
    tags,
    request: {
        params: z.object({
            id: z.string(),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(artistSelectSchema, "spotify artist"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            notFoundSchema,
            "spotify artist not found"
        ),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
            createErrorSchema(IdParamsSchema),
            "Invalid spotify artist id error"
        ),
    },
});
export const getPlaylistById = createRoute({
    path: "/spotify/playlist/{id}",
    method: "get",
    tags,
    request: {
        params: z.object({
            id: z.string(),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            playlistSelectSchema,
            "spotify playlist"
        ),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            notFoundSchema,
            "spotify playlist not found"
        ),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
            createErrorSchema(IdParamsSchema),
            "Invalid spotify playlist id error"
        ),
    },
});
export const getArtistTopTracks = createRoute({
    path: "/spotify/artist/{id}/tracks/top",
    method: "get",
    tags,
    request: {
        params: z.object({
            id: z.string(),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(artistTracksSchema, "artist tracks"),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            notFoundSchema,
            "spotify artist not found"
        ),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
            createErrorSchema(IdParamsSchema),
            "Invalid spotify artist id error"
        ),
    },
});

export const getArtistTracks = createRoute({
    path: "/spotify/artist/{id}/tracks",
    method: "get",
    tags,
    request: {
        params: z.object({
            id: z.string(),
        }),
    },
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            artistTracksSchema,
            "artist tracks from database"
        ),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            notFoundSchema,
            "spotify artist not found in database"
        ),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
            createErrorSchema(IdParamsSchema),
            "Invalid spotify artist id error"
        ),
    },
});

export const getAllTracks = createRoute({
    path: "/spotify/track",
    method: "get",
    tags,
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            z.array(trackSelectSchema),
            "all tracks from database"
        ),
    },
});
export const getAllArtists = createRoute({
    path: "/spotify/artist",
    method: "get",
    tags,
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            z.array(artistSelectSchema),
            "all artists from database"
        ),
    },
});
export const getAllAlbums = createRoute({
    path: "/spotify/album",
    method: "get",
    tags,
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            z.array(albumSelectSchema),
            "all albums from database"
        ),
    },
});

export type GetTrackByIdType = typeof getTrackById;
export type GetAlbumByIdType = typeof getAlbumById;
export type GetArtistByIdType = typeof getArtistById;
export type GetPlaylistByIdType = typeof getPlaylistById;
export type GetArtistTracksType = typeof getArtistTracks;
export type GetArtistTopTracksType = typeof getArtistTopTracks;
export type GetAllTracksType = typeof getAllTracks;
export type GetAllArtistsType = typeof getAllArtists;
export type GetAllAlbumsType = typeof getAllAlbums;
