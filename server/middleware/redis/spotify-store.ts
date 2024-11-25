import { createMiddleware } from "hono/factory";
import axios from "axios";
import qs from "qs";
import { env } from "@/env";
import { redis } from "@/redis";
import { SPOTIFY_TOKEN } from "@/redis/keys";
import type { AppBindings } from "@/lib/types";

export const spotifyApi = createMiddleware<AppBindings>(async (c, next) => {
    if (c.get("spotifyToken")) return await next();

    const redisClient = await redis();
    let spotifyToken = await redisClient.get(SPOTIFY_TOKEN);
    if (!spotifyToken) {
        spotifyToken = await axios
            .post(
                "https://accounts.spotify.com/api/token",
                qs.stringify({
                    grant_type: "client_credentials",
                    client_id: env.SPOTIFY_CLIENT_ID,
                    client_secret: env.SPOTIFY_CLIENT_SECRET,
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            )
            .then(
                (res) =>
                    res.data as {
                        access_token: string;
                        token_type: BuiltinIteratorReturn;
                        expires_in: 3600;
                    }
            )
            .then((token) =>
                redisClient
                    .set(
                        SPOTIFY_TOKEN,
                        token.access_token,
                        "EX",
                        token.expires_in
                    )
                    .then((_) => token.access_token)
            )
            .catch((e) => {
                throw new Error(
                    "failed to retrieve and set spotify token to redis:",
                    e
                );
            });
    }
    c.set("spotifyToken", spotifyToken);
    await next();
});
