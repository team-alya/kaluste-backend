import { z } from "zod";

export const furnitureDetailsSchema = z.object({
  type: z.string(),
  brand: z.string(),
  model: z.string(),
  color: z.string(),
  dimensions: z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
  }),
  age: z.number(),
  condition: z.string(),
});
