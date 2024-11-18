import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { dramaSelectSchema } from "./drama.types";
import { jsonContent } from "stoker/openapi/helpers";

const tags = ["drama"];

export const getAllDrama = createRoute({
    path: "/dramas",
    method: "get",
    tags,
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            z.array(dramaSelectSchema),
            "list of all drama entities"
        ),
    },
});
