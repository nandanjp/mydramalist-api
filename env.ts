import { config } from "dotenv";
import { z } from "zod";
import { expand } from "dotenv-expand";
import path from "node:path";

expand(
    config({
        path: path.resolve(
            process.cwd(),
            process.env.NODE_ENV === "test" ? ".env.test" : ".env.local"
        ),
    })
);

const envSchema = z
    .object({
        NODE_ENV: z
            .enum(["production", "development", "test"])
            .default("development"),
        LOG_LEVEL: z
            .enum([
                "fatal",
                "error",
                "warn",
                "info",
                "debug",
                "trace",
                "silent",
            ])
            .default("info"),
        DATABASE_URL: z
            .string()
            .url()
            .default(
                "postgres://admin:adminpassword@localhost/dramalist?sslmode=disable"
            ),
        DATABASE_AUTH_TOKEN: z.string().optional(),
        SPOTIFY_CLIENT_ID: z.string(),
        SPOTIFY_CLIENT_SECRET: z.string(),
        STRIPE_SECRET_API_KEY: z.string(),
        STRIPE_WEBHOOK_SECRET: z.string(),
        RESEND_API_KEY: z.string(),
        UPSTASH_REDIS_REST_URL: z.string().url(),
        UPSTASH_REDIS_REST_TOKEN: z.string(),
        PORT: z.preprocess(
            (value) => Number(value),
            z.number().positive().default(3000)
        ),
    })
    .superRefine((input, ctx) => {
        if (input.NODE_ENV === "production" && !input.DATABASE_AUTH_TOKEN)
            ctx.addIssue({
                code: z.ZodIssueCode.invalid_type,
                expected: "string",
                received: "undefined",
                path: ["DATABASE_AUTH_TOKEN"],
                message: "Must be set when NODE_ENV is 'production'",
            });
    });
const { data, error } = envSchema.safeParse({
    ...process.env,
});
if (error) {
    console.error("❌ Invalid env:");
    console.error(JSON.stringify(error.flatten().fieldErrors, null, 2));
    process.exit(1);
}

export const env = data;

type EnvSchemaType = z.infer<typeof envSchema>;

declare global {
    namespace NodeJS {
        interface ProcessEnv extends EnvSchemaType {}
    }
}
