import { env } from "./env";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
    out: "./db/migrations",
    schema: "./db/schemas.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: env.DATABASE_URL,
    },
});
