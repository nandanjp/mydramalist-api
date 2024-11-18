import { album, artist, track } from "@/db/schemas";
import { notFoundSchema } from "@/lib/constants";
import { createRoute, z } from "@hono/zod-openapi";
import { createSelectSchema } from "drizzle-zod";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";

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
        [HttpStatusCodes.OK]: jsonContent(
            createSelectSchema(track),
            "spotify track"
        ),
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
        [HttpStatusCodes.OK]: jsonContent(
            createSelectSchema(album, {
                genres: z.array(z.string()),
            }),
            "spotify album"
        ),
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
        [HttpStatusCodes.OK]: jsonContent(
            createSelectSchema(artist, {
                genres: z.array(z.string()),
            }),
            "spotify track"
        ),
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

export type GetTrackByIdType = typeof getTrackById;
export type GetAlbumByIdType = typeof getAlbumById;
export type GetArtistByIdType = typeof getArtistById;
