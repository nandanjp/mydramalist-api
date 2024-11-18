import { createRouter } from "@/lib/create-app";
import * as handlers from "./spotify.handlers";
import * as routes from "./spotify.routes";

export default createRouter().openapi(
    routes.getTrackById,
    handlers.getTrackById
);
