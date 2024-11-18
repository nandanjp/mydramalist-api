import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppBindings, AppOpenAPI } from "./types";
import { defaultHook } from "stoker/openapi";
import { pinoLogger } from "@/middleware/logger";
import { notFound, onError } from "stoker/middlewares";
import { cors } from "hono/cors";
import { env } from "@/env";

export function createRouter() {
    return new OpenAPIHono<AppBindings>({
        strict: false,
        defaultHook,
    });
}

export function getOrigin() {
    const port = env.PORT;
    return `http://localhost:${port}`;
}

export function createApp() {
    const app = createRouter();

    //middleware
    app.use(pinoLogger());
    app.use(
        "/api/*",
        cors({
            origin: getOrigin(),
            allowHeaders: ["Content-Type", "Authorization"],
            allowMethods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
            exposeHeaders: ["Content-Length"],
            maxAge: 60,
            credentials: true,
        })
    );

    app.notFound(notFound);
    app.onError(onError);
    return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
    return createApp().route("/", router);
}
