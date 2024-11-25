import { env } from "@/env";
import { Redis } from "ioredis";

declare global {
    var redis: Redis;
}

export async function redis() {
    if (global.redis) return global.redis;
    global.redis = new Redis({
        host: env.LOCAL_REDIS_DATABASE_HOST,
        port: env.LOCAL_REDIS_DATABASE_PORT,
        lazyConnect: true,
    });
    return await global.redis.connect().then((_) => global.redis);
}
