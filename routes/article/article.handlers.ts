import { db } from "@/db";
import { article } from "@/db/schemas";
import { takeOneOrThrow } from "@/lib/helpers";
import { AppRouteHandler } from "@/lib/types";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { CreateArticle, GetAllArticles, GetOneArticle } from "./article.routes";

export const getAll: AppRouteHandler<GetAllArticles> = async (c) =>
    c.json(await db.select().from(article));

export const getOne: AppRouteHandler<GetOneArticle> = async (c) => {
    const { id } = c.req.valid("param");
    const article = await db.query.article.findFirst({
        where: (article, { eq }) => eq(article.id, id),
    });
    return !article
        ? c.json(
              {
                  message: HttpStatusPhrases.NOT_FOUND,
              },
              HttpStatusCodes.NOT_FOUND
          )
        : c.json(article, HttpStatusCodes.OK);
};

export const create: AppRouteHandler<CreateArticle> = async (c) => {
    const newArticle = await db
        .insert(article)
        .values(c.req.valid("json"))
        .returning()
        .then(
            takeOneOrThrow(
                "failed to insert a new entry into the articles table"
            )
        );
    return c.json(newArticle, HttpStatusCodes.CREATED);
};
