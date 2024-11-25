import configureOpenAPI from "@/lib/configure-open-api";
import { createApp } from "@/lib/create-app";
import index, { authExampleRouter } from "@/routes/index";
import spotifyIndex from "@/routes/spotify/spotify.index";
import stripeIndex from "@/routes/stripe/stripe.index";

export const app = createApp();
configureOpenAPI(app);

const routes = [index, stripeIndex, authExampleRouter, spotifyIndex] as const;

routes.forEach((route) => app.route("/api/v1", route));
export type AppType = (typeof routes)[number];
