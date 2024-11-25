import Stripe from "stripe";
import type { AppRouteHandler } from "@/lib/types";
import type { StripeWebhookType } from "./stripe.routes";
import { env } from "@/env";
import * as HttpStatusCodes from "stoker/http-status-codes";

export const stripeWebhook: AppRouteHandler<StripeWebhookType> = async (c) => {
    const { STRIPE_SECRET_API_KEY, STRIPE_WEBHOOK_SECRET } = env;
    const stripe = new Stripe(STRIPE_SECRET_API_KEY);
    const signature = c.req.header("stripe-signature");
    try {
        if (!signature)
            return c.json(
                {
                    error: {
                        issues: [
                            {
                                code: `${HttpStatusCodes.BAD_REQUEST}`,
                                path: ["/api/webhook"],
                                message:
                                    "failed to extract signature from stripe",
                            },
                        ],
                        name: "stripe signature failure",
                    },
                    success: false,
                },
                HttpStatusCodes.BAD_REQUEST
            );

        const body = await c.req.text();
        const event = await stripe.webhooks.constructEventAsync(
            body,
            signature,
            STRIPE_WEBHOOK_SECRET
        );
        switch (event.type) {
            case "payment_intent.created": {
                console.log(event.data.object);
                break;
            }
            default:
                break;
        }
        return c.json(
            {
                message: "successfully did something with stripe webhook lmfao",
                success: false,
            },
            HttpStatusCodes.OK
        );
    } catch (err) {
        return c.json(
            {
                error: {
                    issues: [
                        {
                            code: `${HttpStatusCodes.BAD_REQUEST}`,
                            path: ["/api/webhook"],
                            message:
                                "failed to process stripe webhook events for some reason lmfao",
                        },
                    ],
                    name: "stripe process event failure",
                },
                success: false,
            },
            HttpStatusCodes.BAD_REQUEST
        );
    }
};
