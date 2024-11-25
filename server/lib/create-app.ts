import { OpenAPIHono } from "@hono/zod-openapi";
import type { AppBindings, AppOpenAPI } from "./types";
import { defaultHook } from "stoker/openapi";
import { pinoLogger } from "@/middleware/logger";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { cors } from "hono/cors";
import { env } from "@/env";
import { auth } from "@/auth/auth";

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

export function getClientOrigin() {
    const port = env.CLIENT_PORT;
    return `http://localhost:${port}`;
}

export function createApp() {
    const app = createRouter();

    //middleware
    app.use(serveEmojiFavicon("😌"));
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
    app.on(["POST", "GET", "PATCH", "PUT", "DELETE"], "/api/v1/auth/*", (c) =>
        auth.handler(c.req.raw)
    );

    app.notFound(notFound);
    app.onError(onError);
    return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
    return createApp().route("/", router);
}
