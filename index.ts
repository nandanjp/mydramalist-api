import { env } from "./env";
import { serve } from "@hono/node-server";
import { app } from "./app";
import { getOrigin } from "@/lib/create-app";

const port = env.PORT;
console.log(`Server is running on port ${getOrigin()}`);

serve({
    port,
    fetch: app.fetch,
});
