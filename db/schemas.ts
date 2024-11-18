import { sql } from "drizzle-orm";
import {
    boolean,
    foreignKey,
    integer,
    pgTable,
    primaryKey,
    text,
    timestamp,
    uuid,
    varchar,
    pgEnum,
    unique,
} from "drizzle-orm/pg-core";

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const userRoleEnum = pgEnum("user_role", ["admin", "pro", "user"]);
export const dramaTypeEnum = pgEnum("drama_type", [
    "drama",
    "special",
    "movie",
    "show",
]);
export const countryTypeEnum = pgEnum("country", [
    "korea",
    "japan",
    "china",
    "hong-kong",
    "taiwan",
    "thailand",
    "philippines",
]);
export const allCountryEnum = pgEnum("country", [
    "United States of America",
    "Afghanistan",
    "Albania",
    "Algeria",
    "Andorra",
    "Angola",
    "Antigua & Deps",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia Herzegovina",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina",
    "Burma",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cape Verde",
    "Central African Rep",
    "Chad",
    "Chile",
    "Republic of China",
    "Colombia",
    "Comoros",
    "Democratic Republic of the Congo",
    "Republic of the Congo",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czech Republic",
    "Danzig",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic",
    "East Timor",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Ethiopia",
    "Fiji",
    "Finland",
    "France",
    "Gabon",
    "Gaza Strip",
    "The Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Grenada",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Holy Roman Empire",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Republic of Ireland",
    "Israel",
    "Italy",
    "Ivory Coast",
    "Jamaica",
    "Japan",
    "Jonathanland",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "North Korea",
    "South Korea",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands",
    "Mauritania",
    "Mauritius",
    "Mexico",
    "Micronesia",
    "Moldova",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mount Athos",
    "Mozambique",
    "Namibia",
    "Nauru",
    "Nepal",
    "Newfoundland",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "Norway",
    "Oman",
    "Ottoman Empire",
    "Pakistan",
    "Palau",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Prussia",
    "Qatar",
    "Romania",
    "Rome",
    "Russian Federation",
    "Rwanda",
    "Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome & Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Swaziland",
    "Sweden",
    "Switzerland",
    "Syria",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Togo",
    "Tonga",
    "Trinidad & Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Vatican City",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Zambia",
    "Zimbabwe",
]);
export const dramaInListStatusEnum = pgEnum("list_status", [
    "watching",
    "completed",
    "planned",
    "hold",
    "dropped",
    "uninterested",
]);
export const dramaInListPriorityEnum = pgEnum("drama_priority", [
    "low",
    "medium",
    "high",
]);
export const actorDramaRoleEnum = pgEnum("actor_role", [
    "director",
    "producer",
    "screenwriter",
    "other",
    "main",
    "support",
    "guest",
]);
export const albumTypeEnum = pgEnum("album_type", [
    "album",
    "single",
    "compilation",
]);
export const artistTypeEnum = pgEnum("artist_type", ["artist"]);
export const trackType = pgEnum("track_type", ["track"]);
export const playlistTypeEnum = pgEnum("playlist_type", ["playlist"]);
export const albumReleaseDatePrecisionEnum = pgEnum("album_release_precision", [
    "year",
    "month",
    "day",
]);

export const user = pgTable("user", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    gender: genderEnum("gender").default("other").notNull(),
    role: userRoleEnum("role").notNull().default("user"),
    join_date: timestamp("created_at", {
        withTimezone: true,
        mode: "string",
    }).default(sql`CURRENT_TIMESTAMP`),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "string",
    })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    lastUpdatedAt: timestamp("last_updated_at", {
        withTimezone: true,
        mode: "string",
    })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    profileImg: text("profile_img").default("").notNull(),
});

export const list = pgTable(
    "list",
    {
        id: uuid("id").primaryKey().defaultRandom().notNull(),
        userId: uuid("user_id").notNull(),
        lastUpdatedAt: timestamp("last_updated_at", {
            withTimezone: true,
            mode: "string",
        }).default(sql`CURRENT_TIMESTAMP`),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [user.id],
            name: "list_user_id_fkey",
        }).onDelete("cascade"),
    ]
);

export const drama = pgTable("drama", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 255 }).default("").notNull(),
    synopsis: text("synopsis").default("").notNull(),
    country: countryTypeEnum("country").notNull(),
    numEpisodes: integer("num_episodes").default(0).notNull(),
    airDateStart: timestamp("air_date_start", {
        withTimezone: true,
        mode: "string",
    }),
    airDateEnd: timestamp("air_date_end", {
        withTimezone: true,
        mode: "string",
    }),
    episodeDuration: integer("episode_duration"),
    publicRating: integer("public_rating").default(0).notNull(),
    nativeTitle: varchar("native_title", { length: 255 }).default("").notNull(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "string",
    })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp("updated_at", {
        withTimezone: true,
        mode: "string",
    })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    dramaType: dramaTypeEnum("type").default("drama").notNull(),
});

export const actor = pgTable("actor", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 255 }).default("").notNull(),
    bio: text("bio").default("").notNull(),
    firstName: varchar("first_name", { length: 255 }).default("").notNull(),
    lastName: varchar("last_name", { length: 255 }).default("").notNull(),
    nativeName: varchar("native_name", { length: 255 }).default("").notNull(),
    nationality: allCountryEnum("nationality").notNull(),
    gender: genderEnum("gender").default("other").notNull(),
    birthday: timestamp("birthday", {
        withTimezone: true,
        mode: "string",
    }),
    age: integer("age"),
});

export const review = pgTable(
    "review",
    {
        id: uuid("id").primaryKey().defaultRandom().notNull(),
        dramaId: uuid("drama_id").notNull(),
        userId: uuid("user_id").notNull(),
        numUpvotes: integer("num_upvotes").default(0).notNull(),
        numEpisodesWatched: integer("episodes_watched").default(0).notNull(),
        overallScore: integer("overall_score").default(0).notNull(),
        storyScore: integer("story_score").default(0).notNull(),
        actingScore: integer("acting_score").default(0).notNull(),
        musicScore: integer("music_score").default(0).notNull(),
        rewatchValue: integer("rewatch_value").default(0).notNull(),
        content: text("content").default("").notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        spoilerBlock: boolean("spoiler_block").default(false).notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.dramaId],
            foreignColumns: [drama.id],
            name: "review_drama_id_fkey",
        }),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [user.id],
            name: "review_user_id_fkey",
        }),
    ]
);

export const comment = pgTable(
    "comment",
    {
        id: uuid("id").primaryKey().defaultRandom().notNull(),
        dramaId: uuid("drama_id").notNull(),
        userId: uuid("user_id").notNull(),
        numLikes: integer("num_likes").default(0).notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.dramaId],
            foreignColumns: [drama.id],
            name: "comment_drama_id_fkey",
        }),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [user.id],
            name: "comment_user_id_fkey",
        }),
    ]
);

export const genre = pgTable("genre", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 255 }).default("").notNull(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "string",
    })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp("updated_at", {
        withTimezone: true,
        mode: "string",
    })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});

export const tag = pgTable("tag", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    name: varchar("name", { length: 255 }).default("").notNull(),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "string",
    })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp("updated_at", {
        withTimezone: true,
        mode: "string",
    })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});

export const dramaInList = pgTable(
    "drama_in_list",
    {
        dramaId: uuid("drama_id").notNull(),
        listId: uuid("list_id").notNull(),
        episodesWatched: integer("episodes_watched").default(0).notNull(),
        userScore: integer("user_score").default(0).notNull(),
        addedAt: timestamp("added_at", {
            withTimezone: true,
            mode: "string",
        }).default(sql`CURRENT_TIMESTAMP`),
        status: dramaInListStatusEnum("status").default("watching").notNull(),
        notes: text("notes").default("").notNull(),
        priority: dramaInListPriorityEnum("priority").default("low").notNull(),
        timesRewatched: integer("times_rewatched").default(0).notNull(),
        firstCompleted: timestamp("first_completed", {
            withTimezone: true,
            mode: "string",
        }),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.listId, table.dramaId] }),
        foreignKey({
            columns: [table.dramaId],
            foreignColumns: [drama.id],
            name: "drama_in_list_drama_id_fkey",
        }),
        foreignKey({
            columns: [table.listId],
            foreignColumns: [list.id],
            name: "drama_in_list_list_id_fkey",
        }),
    ]
);

export const dramaActor = pgTable(
    "drama_actor",
    {
        dramaId: uuid("drama_id").notNull(),
        actorId: uuid("actor_id").notNull(),
        role: actorDramaRoleEnum("role").default("other").notNull(),
        roleName: varchar("role_name").default("").notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.actorId, table.dramaId] }),
        foreignKey({
            columns: [table.dramaId],
            foreignColumns: [drama.id],
            name: "drama_actor_drama_id_fkey",
        }),
        foreignKey({
            columns: [table.actorId],
            foreignColumns: [actor.id],
            name: "drama_actor_actor_id_fkey",
        }),
    ]
);

export const dramaGenre = pgTable(
    "drama_genre",
    {
        dramaId: uuid("drama_id").notNull(),
        genreId: uuid("genre_id").notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.genreId, table.dramaId] }),
        foreignKey({
            columns: [table.dramaId],
            foreignColumns: [drama.id],
            name: "drama_genre_drama_id_fkey",
        }),
        foreignKey({
            columns: [table.genreId],
            foreignColumns: [genre.id],
            name: "drama_genre_genre_id_fkey",
        }),
    ]
);

export const dramaTag = pgTable(
    "drama_tag",
    {
        dramaId: uuid("drama_id").notNull(),
        tagId: uuid("tagId").notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.tagId, table.dramaId] }),
        foreignKey({
            columns: [table.dramaId],
            foreignColumns: [drama.id],
            name: "drama_tag_drama_id_fkey",
        }),
        foreignKey({
            columns: [table.tagId],
            foreignColumns: [tag.id],
            name: "drama_tag_genre_id_fkey",
        }),
    ]
);

export const artist = pgTable(
    "artist",
    {
        id: uuid("id").primaryKey().notNull().defaultRandom(),
        genres: text("genre")
            .array()
            .notNull()
            .default(sql`'{}'::text[]`),
        href: text("href").notNull(),
        spotifyId: text("spotify_id").notNull(),
        artistImage: text("artist_image").notNull().default(""),
        artistImageWidth: integer("artist_image_width").notNull().default(300),
        artistImageHeight: integer("artist_image_height")
            .notNull()
            .default(300),
        name: varchar("name", { length: 255 }).notNull().default(""),
        popularity: integer("popularity").notNull().default(0),
        type: artistTypeEnum("type").notNull().default("artist"),
        uri: text("uri").notNull().default(""),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => [[unique().on(table.spotifyId).nullsNotDistinct()]]
);

export const playlist = pgTable("playlist", {
    id: uuid("id").primaryKey().notNull().defaultRandom(),
    collaborative: boolean("collaborative").notNull().default(false),
    description: text("description").notNull().default(""),
    spotifyId: text("spotify_id").notNull(),
    playlistImage: text("playlist_image").notNull().default(""),
    playlistImageWidth: integer("playlist_image_width").notNull().default(300),
    playlistImageHeight: integer("playlist_image_height")
        .notNull()
        .default(300),
    name: varchar("name", { length: 255 }).notNull().default(""),
    userId: text("user_id").notNull(),
    public: boolean("public").notNull().default(false),
    uri: text("uri").notNull().default(""),
    createdAt: timestamp("created_at", {
        withTimezone: true,
        mode: "string",
    })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
    updatedAt: timestamp("updated_at", {
        withTimezone: true,
        mode: "string",
    })
        .default(sql`CURRENT_TIMESTAMP`)
        .notNull(),
});

export const track = pgTable(
    "album",
    {
        id: uuid("id").primaryKey().notNull().defaultRandom(),
        albumId: uuid("album_id").notNull(),
        durationMs: integer("duration_ms").notNull().default(0),
        explicit: boolean("explicit").notNull().default(false),
        spotifyId: text("spotify_id").notNull(),
        isPlayable: boolean("is_playable").notNull().default(true),
        name: varchar("name", { length: 255 }).notNull(),
        popularity: integer("popularity").notNull().default(0),
        previewUrl: text("preview_url"),
        trackNumber: integer("track_number").notNull().default(0),
        type: trackType("type").notNull().default("track"),
        uri: text("uri").notNull(),
        isLocal: boolean("is_local").notNull().default(false),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => [[unique().on(table.spotifyId).nullsNotDistinct()]]
);

export const trackToArtist = pgTable(
    "track_to_artist",
    {
        trackId: uuid("track_id").notNull(),
        artistId: uuid("artist_id").notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => [
        primaryKey({ columns: [table.trackId, table.artistId] }),
        foreignKey({
            columns: [table.trackId],
            foreignColumns: [track.id],
            name: "track_artist_track_id_fkey",
        }),
        foreignKey({
            columns: [table.artistId],
            foreignColumns: [artist.id],
            name: "track_artist_artist_id_fkey",
        }),
    ]
);

export const album = pgTable(
    "track",
    {
        id: uuid("id").primaryKey().notNull().defaultRandom(),
        type: albumTypeEnum("type").notNull().default("album"),
        totalTracks: integer("total_tracks").notNull().default(0),
        albumImage: text("album_image").notNull(),
        albumImageWidth: integer("album_image_width").notNull().default(300),
        albumImageHeight: integer("album_image_height").notNull().default(300),
        name: varchar("name", { length: 255 }).notNull().default(""),
        spotifyId: text("spotify_id").notNull(),
        genres: text("genre")
            .array()
            .notNull()
            .default(sql`'{}'::text[]`),
        label: text("label").notNull(),
        popularity: integer("popularity").notNull().default(0),
        uri: text("uri").notNull(),
        releaseDate: varchar("release_date", { length: 255 }).notNull(),
        releaseDatePrecision: albumReleaseDatePrecisionEnum(
            "release_date_precision"
        )
            .notNull()
            .default("year"),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => [[unique().on(table.spotifyId).nullsNotDistinct()]]
);

export const artistToAlbum = pgTable(
    "artist_to_album",
    {
        artistId: uuid("artist_id").notNull(),
        albumId: uuid("album_id").notNull(),
        createdAt: timestamp("created_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
        updatedAt: timestamp("updated_at", {
            withTimezone: true,
            mode: "string",
        })
            .default(sql`CURRENT_TIMESTAMP`)
            .notNull(),
    },
    (table) => [
        primaryKey({
            columns: [table.artistId, table.albumId],
        }),
        foreignKey({
            columns: [table.artistId],
            foreignColumns: [artist.id],
            name: "artist_album_artist_id_fkey",
        }),
        foreignKey({
            columns: [table.albumId],
            foreignColumns: [album.id],
            name: "artist_album_album_id_fkey",
        }),
    ]
);
