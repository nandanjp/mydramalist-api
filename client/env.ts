import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    server: {
        SERVER_URL: z.string().url().default("http://localhost:8000/api/v1"),
    },
    clientPrefix: "PUBLIC_",
    client: {},
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});
