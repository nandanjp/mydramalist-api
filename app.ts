import configureOpenAPI from "@/lib/configure-open-api";
import { createApp } from "@/lib/create-app";
import index from "@/routes/index";
import stripeIndex from "@/routes/stripe/stripe.index";
import spotifyIndex from "@/routes/spotify/spotify.index";
import { spotifyApi } from "./middleware/redis/spotify-store";

export const app = createApp();
configureOpenAPI(app);

const routes = [index, stripeIndex] as const;
const spotifyRoutes = [spotifyIndex] as const;

routes.forEach((route) => app.route("/api/v1", route));
spotifyRoutes.forEach((route) => app.use(spotifyApi).route("/api/v1", route));
export type AppType = (typeof routes)[number];
