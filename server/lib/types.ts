import type { Session } from "@/auth/auth";
import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";
import type { PinoLogger } from "hono-pino";

export interface AppBindings {
    Variables: {
        logger: PinoLogger;
        spotifyToken: string;
        user: Session["user"] | null;
        session: Session["session"] | null;
    };
}

export type AppOpenAPI = OpenAPIHono<AppBindings>;
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
    R,
    AppBindings
>;
