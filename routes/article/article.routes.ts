import { createRoute, z } from "@hono/zod-openapi";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { article } from "@/db/schemas";
import { createErrorSchema, IdParamsSchema } from "stoker/openapi/schemas";
import { notFoundSchema } from "@/lib/constants";

const tags = ["articles"];

export const getAll = createRoute({
    path: "/articles",
    method: "get",
    tags,
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            z.array(createSelectSchema(article)),
            "all articles"
        ),
    },
});

export const getOne = createRoute({
    path: "/articles/{id}",
    method: "get",
    request: {
        params: z.object({
            id: z.string().uuid(),
        }),
    },
    tags,
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            createSelectSchema(article),
            "get article by id"
        ),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            notFoundSchema,
            "article not found"
        ),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
            createErrorSchema(IdParamsSchema),
            "Invalid id error"
        ),
    },
});

export const create = createRoute({
    path: "/articles",
    method: "post",
    tags,
    request: {
        body: jsonContentRequired(
            createInsertSchema(article),
            "The article to create"
        ),
    },
    responses: {
        [HttpStatusCodes.CREATED]: jsonContent(
            createSelectSchema(article),
            "The created article"
        ),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
            createErrorSchema(createInsertSchema(article)),
            "The validation error(s)"
        ),
    },
});

export type GetAllArticles = typeof getAll;
export type GetOneArticle = typeof getOne;
export type CreateArticle = typeof create;
