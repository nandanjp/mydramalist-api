import { createRouter } from "@/lib/create-app";
import * as handlers from "./article.handlers";
import * as routes from "./article.routes";

export default createRouter()
    .openapi(routes.getAll, handlers.getAll)
    .openapi(routes.getOne, handlers.getOne)
    .openapi(routes.create, handlers.create);
