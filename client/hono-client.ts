import { createHonoClient } from "@server/index";

declare const globalThis: {
    honoClient: ReturnType<typeof createHonoClient>;
} & typeof global;

const honoClient = globalThis.honoClient ?? createHonoClient();
export default honoClient;

if (process.env.NODE_ENV !== "production") globalThis.honoClient = honoClient;
