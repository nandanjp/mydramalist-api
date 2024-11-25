import type { DrizzleTransactionType } from "@/db";
import {
    album,
    artist,
    artistToAlbum,
    playlist,
    track,
    trackToArtist,
} from "@/db/schemas";
import { getRequest } from "@/lib/generic-api-call";
import { takeOneOrThrow } from "@/lib/helpers";
import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";

const BASE_ENDPOINT = "https://api.spotify.com/v1" as const;
export enum Resource {
    Tracks = "tracks",
    Albums = "albums",
    Artists = "artists",
    Playlists = "playlists",
}
export enum Extraneous {
    TopTracks = "top-tracks",
}

export const getSpotifyResource = <T>(
    spotifyToken: string,
    ...args: string[]
) =>
    getRequest<T>(`${BASE_ENDPOINT}/${args.join("/")}`, {
        Authorization: `Bearer ${spotifyToken}`,
    });

export const trackSelectSchema = createSelectSchema(track);
export const albumSelectSchema = createSelectSchema(album, {
    genres: z.array(z.string()),
});
export const artistSelectSchema = createSelectSchema(artist, {
    genres: z.array(z.string()),
});
export const playlistSelectSchema = createSelectSchema(playlist);
export const artistTracksSchema = z.object({
    artist: artistSelectSchema,
    tracks: z.array(trackSelectSchema),
});

export type TrackTypeType = z.infer<typeof trackSelectSchema>["type"];
export type AlbumTypeType = z.infer<typeof albumSelectSchema>["type"];
export type ArtistTypeType = z.infer<typeof artistSelectSchema>["type"];
export type ReleaseDatePrecisionType = z.infer<
    typeof albumSelectSchema
>["releaseDatePrecision"];
export type ArtistTracksType = z.infer<typeof artistTracksSchema>;

export const transactionInsertIntoTrack = async (
    tx: DrizzleTransactionType,
    values: typeof track.$inferInsert
) =>
    tx
        .insert(track)
        .values(values)
        .returning()
        .then(
            takeOneOrThrow(
                "failed to insert only a single row into the albums table"
            )
        );

export const transactionInsertIntoAlbum = async (
    tx: DrizzleTransactionType,
    values: typeof album.$inferInsert
) =>
    tx
        .insert(album)
        .values(values)
        .returning()
        .then(
            takeOneOrThrow(
                "failed to insert only a single row into the albums table"
            )
        );

export const transactionInsertIntoArtist = async (
    tx: DrizzleTransactionType,
    values: typeof artist.$inferInsert
) =>
    tx
        .insert(artist)
        .values(values)
        .returning()
        .then(
            takeOneOrThrow(
                "failed to insert a single artist into the artist table"
            )
        );

export const transactionInsertIntoPlaylist = async (
    tx: DrizzleTransactionType,
    values: typeof playlist.$inferInsert
) =>
    tx
        .insert(playlist)
        .values(values)
        .returning()
        .then(
            takeOneOrThrow(
                "failed to insert a single playlist into the playlist table"
            )
        );

export const transactionInsertIntoTrackToArtist = async (
    tx: DrizzleTransactionType,
    values: typeof trackToArtist.$inferInsert
) =>
    tx
        .insert(trackToArtist)
        .values(values)
        .returning()
        .then(
            takeOneOrThrow(
                "failed to insert a single entry into the track to artist relation table"
            )
        );

export const transactionInsertIntoArtistToAlbum = async (
    tx: DrizzleTransactionType,
    values: typeof artistToAlbum.$inferInsert
) =>
    tx
        .insert(artistToAlbum)
        .values(values)
        .returning()
        .then(
            takeOneOrThrow(
                "failed to insert a single entry into the artist to album relation table"
            )
        );
