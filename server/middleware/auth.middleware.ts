import { auth } from "@/auth/auth";
import type { AppBindings } from "@/lib/types";
import { createMiddleware } from "hono/factory";

export const sessionMiddleware = createMiddleware<AppBindings>(
    async (c, next) => {
        const session = await auth.api.getSession({
            headers: c.req.raw.headers,
        });
        if (!session) {
            c.set("user", null);
            c.set("session", null);
            return next();
        }

        c.set("user", session.user);
        c.set("session", session.session);
        return await next();
    }
);
