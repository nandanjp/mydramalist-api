import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { createRouter } from "@/lib/create-app";
import { jsonContent } from "stoker/openapi/helpers";
import { createMessageObjectSchema } from "stoker/openapi/schemas";

const router = createRouter().openapi(
    createRoute({
        tags: ["Index"],
        method: "get",
        path: "/",
        responses: {
            [HttpStatusCodes.OK]: jsonContent(
                createMessageObjectSchema("Mydramalist"),
                "Mydramalist Home"
            ),
        },
    }),
    (c) => c.json({ message: "Mydramalist" }, HttpStatusCodes.OK)
);

export default router;
