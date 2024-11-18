import { createRouter } from "@/lib/create-app";
import * as handlers from "./stripe.handlers";
import * as routes from "./stripe.routes";

export default createRouter().openapi(
    routes.stripeWebhook,
    handlers.stripeWebhook
);
