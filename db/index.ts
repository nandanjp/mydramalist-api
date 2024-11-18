import { drizzle } from "drizzle-orm/node-postgres";
import { env } from "../env.js";
import * as schemas from "./schemas";
import * as relations from "./relations";

const newDrizzle = () =>
    drizzle({
        connection: env.DATABASE_URL,
        schema: { ...schemas, ...relations },
        casing: "camelCase",
    });

declare global {
    var db: ReturnType<typeof newDrizzle>;
}

if (!global.db) global.db = newDrizzle();
export default global.db;
