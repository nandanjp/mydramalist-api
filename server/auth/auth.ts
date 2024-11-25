import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schemas from "@/db/schemas";
import db from "@/db";
import { redis } from "@/redis";
import { env } from "@/env";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...schemas,
        },
    }),
    secondaryStorage: {
        get: async (key) =>
            await redis().then((redisClient) => redisClient.get(key)),
        set: async (key, value, ttl) => {
            if (ttl)
                await redis().then((redisClient) =>
                    redisClient.set(key, JSON.stringify(value), "EX", ttl)
                );
            else
                await redis().then((redisClient) =>
                    redisClient.set(key, JSON.stringify(value))
                );
        },
        delete: async (key) =>
            await redis().then((redisClient) =>
                redisClient.del(key).then((res) => res.toString())
            ),
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
        },
        discord: {
            clientId: env.DISCORD_CLIENT_ID,
            clientSecret: env.DISCORD_CLIENT_SECRET,
        },
    },
    secret: env.BETTER_AUTH_SECRET,
    emailVerification: {
        sendOnSignUp: true,
    },
});

export type Session = typeof auth.$Infer.Session;
