import db from "@/db";
import type { AppRouteHandler } from "@/lib/types";
import * as HttpStatusCodes from "stoker/http-status-codes";
import {
    Extraneous,
    getSpotifyResource,
    Resource,
    transactionInsertIntoAlbum,
    transactionInsertIntoArtist,
    transactionInsertIntoArtistToAlbum,
    transactionInsertIntoPlaylist,
    transactionInsertIntoTrack,
    transactionInsertIntoTrackToArtist,
    type AlbumTypeType,
    type ArtistTypeType,
    type ReleaseDatePrecisionType,
    type TrackTypeType,
} from "./spotify.queries";
import type {
    GetAlbumByIdType,
    GetAllAlbumsType,
    GetAllArtistsType,
    GetAllTracksType,
    GetArtistByIdType,
    GetArtistTopTracksType,
    GetArtistTracksType,
    GetPlaylistByIdType,
    GetTrackByIdType,
} from "./spotify.routes";
import {
    type Playlist,
    type Album,
    type Artist,
    type Track,
    type Tracks,
} from "./types";
import { album, artist, track } from "@/db/schemas";

export const getTrackById: AppRouteHandler<GetTrackByIdType> = async (c) => {
    const { id } = c.req.valid("param");
    const existingTrack = await db.query.track.findFirst({
        where: (t, { eq }) => eq(t.spotifyId, id),
    });
    if (existingTrack) return c.json(existingTrack, HttpStatusCodes.OK);

    const spotifyToken = c.get("spotifyToken");
    const spotifyTrack = await getSpotifyResource<Track>(
        spotifyToken,
        Resource.Tracks,
        id
    );
    const spotifyAlbum = await getSpotifyResource<Album>(
        spotifyToken,
        Resource.Albums,
        spotifyTrack.album.id
    );
    const spotifyArtists = await Promise.all(
        spotifyTrack.artists.map((artist) =>
            getSpotifyResource<Artist>(
                spotifyToken,
                Resource.Artists,
                artist.id
            )
        )
    );

    return await db.transaction(async (tx) => {
        const newAlbum = await tx.query.album
            .findFirst({
                where: (a, { eq }) => eq(a.spotifyId, spotifyAlbum.id),
            })
            .then((exists) => {
                if (exists) return exists;
                return transactionInsertIntoAlbum(tx, {
                    name: spotifyAlbum.name,
                    spotifyId: spotifyAlbum.id,
                    type: spotifyAlbum.type as AlbumTypeType,
                    albumImage: spotifyAlbum.images[0].url,
                    albumImageHeight: spotifyAlbum.images[0].height,
                    albumImageWidth: spotifyAlbum.images[0].width,
                    label: spotifyAlbum.label,
                    popularity: spotifyAlbum.popularity,
                    releaseDate: spotifyAlbum.release_date,
                    releaseDatePrecision:
                        spotifyAlbum.release_date_precision as ReleaseDatePrecisionType,
                    totalTracks: spotifyAlbum.total_tracks,
                    genres: spotifyAlbum.genres,
                    uri: spotifyAlbum.uri,
                });
            });

        const newTrack = await transactionInsertIntoTrack(tx, {
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
            type: spotifyTrack.type as TrackTypeType,
            uri: spotifyTrack.uri,
        });

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
                    transactionInsertIntoArtist(tx, {
                        name: spotifyArtist.name,
                        href: spotifyArtist.href,
                        spotifyId: spotifyArtist.id,
                        artistImage: spotifyArtist.images[0].url,
                        artistImageHeight: spotifyArtist.images[0].height,
                        artistImageWidth: spotifyArtist.images[0].width,
                        genres: spotifyArtist.genres,
                        popularity: spotifyArtist.popularity,
                        type: spotifyArtist.type as ArtistTypeType,
                        uri: spotifyArtist.uri,
                    })
                )
        );

        await Promise.all([
            ...newArtists.map((artist) =>
                transactionInsertIntoTrackToArtist(tx, {
                    artistId: artist.id,
                    trackId: newTrack.id,
                })
            ),
            ...newArtists.map((artist) =>
                transactionInsertIntoArtistToAlbum(tx, {
                    artistId: artist.id,
                    albumId: newAlbum.id,
                })
            ),
        ]);

        return c.json(newTrack, HttpStatusCodes.OK);
    });
};

export const getAlbumById: AppRouteHandler<GetAlbumByIdType> = async (c) => {
    const { id } = c.req.valid("param");
    const existingAlbum = await db.query.album.findFirst({
        where: (album, { eq }) => eq(album.spotifyId, id),
    });
    if (existingAlbum) return c.json(existingAlbum, HttpStatusCodes.OK);

    return await getSpotifyResource<Album>(
        c.get("spotifyToken"),
        Resource.Albums,
        id
    )
        .then((spotifyAlbum) =>
            db.transaction((tx) =>
                transactionInsertIntoAlbum(tx, {
                    albumImage: spotifyAlbum.images[0].url,
                    albumImageHeight: spotifyAlbum.images[0].height,
                    albumImageWidth: spotifyAlbum.images[0].width,
                    label: spotifyAlbum.label,
                    releaseDate: spotifyAlbum.release_date,
                    releaseDatePrecision:
                        spotifyAlbum.release_date_precision as ReleaseDatePrecisionType,
                    spotifyId: spotifyAlbum.id,
                    uri: spotifyAlbum.uri,
                    genres: spotifyAlbum.genres,
                    name: spotifyAlbum.name,
                    popularity: spotifyAlbum.popularity,
                    totalTracks: spotifyAlbum.total_tracks,
                    type: spotifyAlbum.type as AlbumTypeType,
                })
            )
        )
        .then((newAlbum) => c.json(newAlbum, HttpStatusCodes.OK));
};

export const getArtistById: AppRouteHandler<GetArtistByIdType> = async (c) => {
    const { id } = c.req.valid("param");
    const existingArtist = await db.query.artist.findFirst({
        where: (artist, { eq }) => eq(artist.spotifyId, id),
    });
    if (existingArtist) return c.json(existingArtist, HttpStatusCodes.OK);

    return await getSpotifyResource<Artist>(
        c.get("spotifyToken"),
        Resource.Artists,
        id
    )
        .then((spotifyArtist) =>
            db.transaction((tx) =>
                transactionInsertIntoArtist(tx, {
                    href: spotifyArtist.href,
                    spotifyId: spotifyArtist.id,
                    artistImage: spotifyArtist.images[0].url,
                    artistImageHeight: spotifyArtist.images[0].height,
                    artistImageWidth: spotifyArtist.images[0].width,
                    genres: spotifyArtist.genres,
                    name: spotifyArtist.name,
                    popularity: spotifyArtist.popularity,
                    uri: spotifyArtist.uri,
                    type: spotifyArtist.type as ArtistTypeType,
                })
            )
        )
        .then((newArtist) => c.json(newArtist, HttpStatusCodes.OK));
};

export const getPlaylistById: AppRouteHandler<GetPlaylistByIdType> = async (
    c
) => {
    const { id } = c.req.valid("param");
    const existingPlaylist = await db.query.playlist.findFirst({
        where: (list, { eq }) => eq(list.spotifyId, id),
    });
    if (existingPlaylist) return c.json(existingPlaylist, HttpStatusCodes.OK);

    return await getSpotifyResource<Playlist>(
        c.get("spotifyToken"),
        Resource.Playlists,
        id
    )
        .then((spotifyPlaylist) =>
            db.transaction((tx) =>
                transactionInsertIntoPlaylist(tx, {
                    spotifyId: spotifyPlaylist.id,
                    collaborative: spotifyPlaylist.collaborative,
                    description: spotifyPlaylist.description,
                    name: spotifyPlaylist.name,
                    playlistImage: spotifyPlaylist.images[0].url,
                    playlistImageHeight: spotifyPlaylist.images[0].height,
                    playlistImageWidth: spotifyPlaylist.images[0].width,
                    public: spotifyPlaylist.public,
                    uri: spotifyPlaylist.uri,
                    userId: spotifyPlaylist.owner.id,
                })
            )
        )
        .then((newPlaylist) => c.json(newPlaylist, HttpStatusCodes.OK));
};

export const getArtistTracks: AppRouteHandler<GetArtistTracksType> = async (
    c
) => {
    const artist = await db.query.artist.findFirst({
        where: (a, { eq }) => eq(a.spotifyId, c.req.valid("param").id),
    });
    if (!artist)
        return c.json(
            { message: "artist was not found with the given id" },
            HttpStatusCodes.NOT_FOUND
        );

    const tracks = await db.query.trackToArtist.findMany({
        columns: {},
        where: (ta, { eq }) => eq(ta.artistId, artist.id),
        with: {
            track: true,
        },
    });
    return c.json(
        {
            artist,
            tracks: tracks.map((track) => track.track),
        },
        HttpStatusCodes.OK
    );
};

export const getArtistTopTracks: AppRouteHandler<
    GetArtistTopTracksType
> = async (c) => {
    const { id } = c.req.valid("param");
    const spotifyToken = c.get("spotifyToken");
    const logger = c.get("logger");
    return await db.transaction(async (tx) => {
        const artist = await db.query.artist
            .findFirst({
                where: (a, { eq }) => eq(a.spotifyId, id),
            })
            .then(
                (retrievedArtist) =>
                    retrievedArtist ??
                    getSpotifyResource<Artist>(
                        spotifyToken,
                        Resource.Artists,
                        id
                    ).then((spotifyArtist) =>
                        transactionInsertIntoArtist(tx, {
                            href: spotifyArtist.href,
                            spotifyId: spotifyArtist.id,
                            artistImage: spotifyArtist.images[0].url,
                            artistImageHeight: spotifyArtist.images[0].height,
                            artistImageWidth: spotifyArtist.images[0].width,
                            genres: spotifyArtist.genres,
                            name: spotifyArtist.name,
                            popularity: spotifyArtist.popularity,
                            uri: spotifyArtist.uri,
                            type: spotifyArtist.type as ArtistTypeType,
                        })
                    )
            );

        const spotifyTopTenTracks = await getSpotifyResource<Tracks>(
            spotifyToken,
            Resource.Artists,
            id,
            Extraneous.TopTracks
        );

        const trackAlbums = await Promise.all(
            spotifyTopTenTracks.tracks.map(
                async ({ album: spotifyAlbum, artists, ...spotifyTrack }) => {
                    const existingAlbum = await tx.query.album.findFirst({
                        where: (a, { eq }) => eq(a.spotifyId, spotifyAlbum.id),
                        with: {
                            tracks: {
                                where: (t, { eq }) =>
                                    eq(t.spotifyId, spotifyTrack.id),
                            },
                        },
                    });
                    logger.info(spotifyTrack.id);
                    if (existingAlbum) {
                        if (existingAlbum.tracks.length > 0)
                            return {
                                newAlbum: existingAlbum,
                                newTrack: existingAlbum.tracks[0],
                            };

                        return {
                            newAlbum: existingAlbum,
                            newTrack: await transactionInsertIntoTrack(tx, {
                                albumId: existingAlbum.id,
                                durationMs: spotifyTrack.duration_ms,
                                explicit: spotifyTrack.explicit,
                                isLocal: spotifyTrack.is_local,
                                isPlayable: spotifyTrack.is_playable,
                                name: spotifyTrack.name,
                                popularity: spotifyTrack.popularity,
                                previewUrl: spotifyTrack.preview_url,
                                spotifyId: spotifyTrack.id,
                                trackNumber: spotifyTrack.track_number,
                                type: spotifyTrack.type as TrackTypeType,
                                uri: spotifyTrack.uri,
                            }),
                        };
                    }
                    return await transactionInsertIntoAlbum(tx, {
                        albumImage: spotifyAlbum.images[0].url,
                        albumImageHeight: spotifyAlbum.images[0].height,
                        albumImageWidth: spotifyAlbum.images[0].width,
                        label: spotifyAlbum.label,
                        releaseDate: spotifyAlbum.release_date,
                        releaseDatePrecision:
                            spotifyAlbum.release_date_precision as ReleaseDatePrecisionType,
                        spotifyId: spotifyAlbum.id,
                        uri: spotifyAlbum.uri,
                        genres: spotifyAlbum.genres,
                        name: spotifyAlbum.name,
                        popularity: spotifyAlbum.popularity,
                        totalTracks: spotifyAlbum.total_tracks,
                        type: spotifyAlbum.type as AlbumTypeType,
                    }).then((newAlbum) =>
                        transactionInsertIntoTrack(tx, {
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
                            type: spotifyTrack.type as TrackTypeType,
                            uri: spotifyTrack.uri,
                        }).then((newTrack) => ({ newTrack, newAlbum }))
                    );
                }
            )
        );
        await Promise.all([
            ...trackAlbums.map(async ({ newTrack }) => {
                if (
                    !(await tx.query.trackToArtist.findFirst({
                        where: (ta, { and, eq }) =>
                            and(
                                eq(ta.artistId, artist.id),
                                eq(ta.trackId, newTrack.id)
                            ),
                    }))
                )
                    await transactionInsertIntoTrackToArtist(tx, {
                        artistId: artist.id,
                        trackId: newTrack.id,
                    });
            }),
            ...trackAlbums.map(async ({ newAlbum }) => {
                if (
                    !(await tx.query.artistToAlbum.findFirst({
                        where: (ta, { and, eq }) =>
                            and(
                                eq(ta.artistId, artist.id),
                                eq(ta.albumId, newAlbum.id)
                            ),
                    }))
                )
                    await transactionInsertIntoArtistToAlbum(tx, {
                        artistId: artist.id,
                        albumId: newAlbum.id,
                    });
            }),
        ]);

        return c.json(
            { artist, tracks: trackAlbums.map(({ newTrack }) => newTrack) },
            HttpStatusCodes.OK
        );
    });
};

export const getAllTracks: AppRouteHandler<GetAllTracksType> = async (c) =>
    c.json(await db.select().from(track), HttpStatusCodes.OK);
export const getAllArtists: AppRouteHandler<GetAllArtistsType> = async (c) =>
    c.json(await db.select().from(artist), HttpStatusCodes.OK);
export const getAllAlbums: AppRouteHandler<GetAllAlbumsType> = async (c) =>
    c.json(await db.select().from(album), HttpStatusCodes.OK);
