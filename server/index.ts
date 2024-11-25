import { env } from "./env";
import { serve } from "@hono/node-server";
import { app, type AppType } from "./app";
import { getClientOrigin, getOrigin } from "@/lib/create-app";
import { hc } from "hono/client";

export const createHonoClient = () => hc<AppType>(getClientOrigin());

const port = env.PORT;
console.log(`Server is running on port ${getOrigin()}`);

serve({
    port,
    fetch: app.fetch,
});
