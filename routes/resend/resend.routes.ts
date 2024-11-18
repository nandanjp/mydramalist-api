import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

export const resendWebhook = createRoute({
    path: "resend/webhook",
    method: "post",
    tags: ["resend-webhook"],
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            z.object({
                message: z.string(),
            }),
            "successfully handled resend webhook events"
        ),
        [HttpStatusCodes.BAD_REQUEST]: jsonContent(
            createErrorSchema(z.string()),
            "successfully handled resend webhook events"
        ),
    },
});

export type ResendWebhookType = typeof resendWebhook;
