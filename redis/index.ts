import { env } from "@/env";
import { Redis } from "@upstash/redis";

declare global {
    var redis: Redis;
}

export async function redis() {
    if (global.redis) return global.redis;
    global.redis = new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
    });
    return global.redis;
}
