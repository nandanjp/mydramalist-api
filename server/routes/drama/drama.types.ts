import { drama } from "@/db/schemas";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import type { z } from "zod";

export const dramaSelectSchema = createSelectSchema(drama);
export const dramaInsertSchema = createInsertSchema(drama);
export type DramaSelectType = z.infer<typeof dramaSelectSchema>;
export type DramaInsertType = z.infer<typeof dramaInsertSchema>;
