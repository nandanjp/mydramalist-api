import { z } from "@hono/zod-openapi";
declare const IdParamsSchema: z.ZodObject<
    {
        id: z.ZodNumber;
    },
    "strip",
    z.ZodTypeAny,
    {
        id: number;
    },
    {
        id: number;
    }
>;
export default IdParamsSchema;
