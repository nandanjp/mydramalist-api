import { relations } from "drizzle-orm";
import {
    actor,
    album,
    artist,
    artistToAlbum,
    comment,
    drama,
    dramaActor,
    dramaGenre,
    dramaInList,
    dramaTag,
    genre,
    list,
    review,
    tag,
    track,
    trackToArtist,
    user,
} from "./schemas";

export const userRelations = relations(user, ({ many }) => ({
    comments: many(comment),
    reviews: many(review),
}));

export const listRelations = relations(list, ({ one }) => ({
    user: one(user, {
        fields: [list.userId],
        references: [user.id],
    }),
}));
export const commentRelations = relations(comment, ({ one }) => ({
    user: one(user, {
        fields: [comment.userId],
        references: [user.id],
    }),
    drama: one(drama, {
        fields: [comment.dramaId],
        references: [drama.id],
    }),
}));
export const reviewRelations = relations(review, ({ one }) => ({
    user: one(user, {
        fields: [review.userId],
        references: [user.id],
    }),
    drama: one(drama, {
        fields: [review.dramaId],
        references: [drama.id],
    }),
}));
export const dramaRelations = relations(drama, ({ many }) => ({
    tags: many(dramaTag),
    genres: many(dramaGenre),
    actors: many(dramaActor),
}));
export const actorRelations = relations(actor, ({ many }) => ({
    dramas: many(dramaActor),
}));
export const tagRelations = relations(tag, ({ many }) => ({
    dramas: many(dramaTag),
}));
export const genreRelations = relations(genre, ({ many }) => ({
    dramas: many(dramaGenre),
}));
export const dramaInListRelations = relations(dramaInList, ({ one }) => ({
    list: one(list, {
        fields: [dramaInList.listId],
        references: [list.id],
    }),
    drama: one(drama, {
        fields: [dramaInList.dramaId],
        references: [drama.id],
    }),
}));
export const dramaTagRelations = relations(dramaTag, ({ one }) => ({
    tag: one(tag, {
        fields: [dramaTag.tagId],
        references: [tag.id],
    }),
    drama: one(drama, {
        fields: [dramaTag.dramaId],
        references: [drama.id],
    }),
}));
export const dramaGenreRelations = relations(dramaGenre, ({ one }) => ({
    genre: one(genre, {
        fields: [dramaGenre.genreId],
        references: [genre.id],
    }),
    drama: one(drama, {
        fields: [dramaGenre.dramaId],
        references: [drama.id],
    }),
}));
export const dramaActorRelations = relations(dramaActor, ({ one }) => ({
    actor: one(actor, {
        fields: [dramaActor.actorId],
        references: [actor.id],
    }),
    drama: one(drama, {
        fields: [dramaActor.dramaId],
        references: [drama.id],
    }),
}));
export const trackArtistRelations = relations(trackToArtist, ({ one }) => ({
    track: one(track, {
        fields: [trackToArtist.trackId],
        references: [track.id],
    }),
    artist: one(artist, {
        fields: [trackToArtist.artistId],
        references: [artist.id],
    }),
}));
export const trackAlbumRelations = relations(track, ({ one }) => ({
    album: one(album, {
        fields: [track.albumId],
        references: [album.id],
    }),
}));
export const albumTrackRelations = relations(album, ({ many }) => ({
    tracks: many(track),
}));
export const artistAlbumRelations = relations(artistToAlbum, ({ one }) => ({
    artist: one(artist, {
        fields: [artistToAlbum.artistId],
        references: [artist.id],
    }),
    album: one(album, {
        fields: [artistToAlbum.albumId],
        references: [album.id],
    }),
}));
