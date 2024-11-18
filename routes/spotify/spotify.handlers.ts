import db from "@/db";
import {
    album,
    artist,
    artistToAlbum,
    track,
    trackToArtist,
} from "@/db/schemas";
import { takeOneOrThrow } from "@/lib/helpers";
import type { AppRouteHandler } from "@/lib/types";
import axios from "axios";
import * as HttpStatusCodes from "stoker/http-status-codes";
import {
    GET_ALBUM_ENDPOINT,
    GET_ARTIST_ENDPOINT,
    GET_TRACK_ENDPOINT,
} from "./endpoints";
import type { GetTrackByIdType } from "./spotify.routes";
import type { Album, Artist, Track } from "./types";

export const getTrackById: AppRouteHandler<GetTrackByIdType> = async (c) => {
    const { id } = c.req.valid("param");
    const existingTrack = await db.query.track.findFirst({
        where: (t, { eq }) => eq(t.spotifyId, id),
    });
    if (existingTrack) return c.json(existingTrack, HttpStatusCodes.OK);

    const spotifyToken = c.get("spotifyToken");
    const spotifyTrack = await axios
        .get(`${GET_TRACK_ENDPOINT}/${id}`, {
            headers: {
                Authorization: `Bearer ${spotifyToken}`,
            },
        })
        .then((res) => res.data as Track);
    const spotifyAlbum = await axios
        .get(`${GET_ALBUM_ENDPOINT}/${spotifyTrack.album.id}`, {
            headers: {
                Authorization: `Bearer ${spotifyToken}`,
            },
        })
        .then((res) => res.data as Album);
    const spotifyArtists = await Promise.all(
        spotifyTrack.artists.map((artist) =>
            axios
                .get(`${GET_ARTIST_ENDPOINT}/${artist.id}`, {
                    headers: {
                        Authorization: `Bearer ${spotifyToken}`,
                    },
                })
                .then((res) => res.data as Artist)
        )
    );

    return await db.transaction(async (tx) => {
        const newAlbum = await tx.query.album
            .findFirst({
                where: (a, { eq }) => eq(a.spotifyId, spotifyAlbum.id),
            })
            .then((exists) => {
                if (exists) return exists;
                return tx
                    .insert(album)
                    .values({
                        name: spotifyAlbum.name,
                        spotifyId: spotifyAlbum.id,
                        type: spotifyAlbum.type,
                        albumImage: spotifyAlbum.images[0].url,
                        albumImageHeight: spotifyAlbum.images[0].height,
                        albumImageWidth: spotifyAlbum.images[0].width,
                        label: spotifyAlbum.label,
                        popularity: spotifyAlbum.popularity,
                        releaseDate: spotifyAlbum.release_date,
                        releaseDatePrecision:
                            spotifyAlbum.release_date_precision,
                        totalTracks: spotifyAlbum.total_tracks,
                        genres: spotifyAlbum.genres,
                        uri: spotifyAlbum.uri,
                    } as typeof album.$inferInsert)
                    .returning()
                    .then(
                        takeOneOrThrow(
                            "failed to insert only a single row into the albums table"
                        )
                    );
            });

        const newTrack = await tx
            .insert(track)
            .values({
                albumId: newAlbum.id,
                durationMs: spotifyTrack.duration_ms,
                explicit: spotifyTrack.explicit,
                isLocal: spotifyTrack.is_local,
                isPlayable: spotifyTrack.is_playable,
                name: spotifyTrack.name,
                popularity: spotifyTrack.popularity,
                previewUrl: spotifyTrack.preview_url,
                spotifyId: spotifyTrack.id,
                trackNumber: spotifyTrack.track_number,
                type: spotifyTrack.type,
                uri: spotifyTrack.uri,
            } as typeof track.$inferInsert)
            .returning()
            .then(
                takeOneOrThrow(
                    "failed to insert only a single row into the albums table"
                )
            );

        const existingArtists = await tx.query.artist
            .findMany({
                columns: {
                    spotifyId: true,
                },
                where: (a, { inArray }) =>
                    inArray(
                        a.spotifyId,
                        spotifyArtists.map((s) => s.id)
                    ),
            })
            .then((rows) => new Set(rows.map((row) => row.spotifyId)));
        const newArtists = await Promise.all(
            spotifyArtists
                .filter((artist) => !existingArtists.has(artist.id))
                .map((spotifyArtist) =>
                    tx
                        .insert(artist)
                        .values({
                            name: spotifyArtist.name,
                            href: spotifyArtist.href,
                            spotifyId: spotifyArtist.id,
                            artistImage: spotifyArtist.images[0].url,
                            artistImageHeight: spotifyArtist.images[0].height,
                            artistImageWidth: spotifyArtist.images[0].width,
                            genres: spotifyArtist.genres,
                            popularity: spotifyArtist.popularity,
                            type: spotifyArtist.type,
                            uri: spotifyArtist.uri,
                        } as typeof artist.$inferInsert)
                        .returning()
                        .then(
                            takeOneOrThrow(
                                "failed to insert a single artist into the artist table"
                            )
                        )
                )
        );

        await Promise.all([
            ...newArtists.map((artist) =>
                tx
                    .insert(trackToArtist)
                    .values({
                        artistId: artist.id,
                        trackId: newTrack.id,
                    } as typeof trackToArtist.$inferInsert)
                    .returning()
                    .then(
                        takeOneOrThrow(
                            "failed to insert a single entry into the track to artist relation table"
                        )
                    )
            ),
            ...newArtists.map((artist) =>
                tx
                    .insert(artistToAlbum)
                    .values({
                        artistId: artist.id,
                        albumId: newAlbum.id,
                    } as typeof artistToAlbum.$inferInsert)
                    .returning()
                    .then(
                        takeOneOrThrow(
                            "failed to insert a single entry into the artist to album relation table"
                        )
                    )
            ),
        ]);

        return c.json(newTrack, HttpStatusCodes.OK);
    });
};
