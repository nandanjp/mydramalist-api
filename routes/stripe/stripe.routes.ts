import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

export const stripeWebhook = createRoute({
    path: "/stripe/webhook",
    method: "post",
    tags: ["stripe-webhook"],
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            z.object({
                message: z.string(),
            }),
            "stripe event handled"
        ),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            createErrorSchema(z.string()),
            "failed in stripe webhook"
        ),
    },
});

export type StripeWebhookType = typeof stripeWebhook;
