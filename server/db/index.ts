import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "@/env";
import * as schemas from "./schemas";
import * as relations from "./relations";

const newDrizzle = () =>
    drizzle({
        connection: env.DATABASE_URL,
        schema: { ...schemas, ...relations },
        casing: "camelCase",
    });

export type DrizzleConnectionType = ReturnType<typeof newDrizzle>;
export type DrizzleTransactionType = Parameters<
    Parameters<DrizzleConnectionType["transaction"]>[0]
>[0];
declare global {
    var db: DrizzleConnectionType;
}

if (!global.db) global.db = newDrizzle();
export default global.db;
