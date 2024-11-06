import { z } from "zod";

export const furnitureDetailsSchema = z.object({
  merkki: z.string(),
  malli: z.string(),
  väri: z.string(),
  mitat: z.object({
    pituus: z.number(),
    leveys: z.number(),
    korkeus: z.number(),
  }),
  materiaalit: z.array(z.string()),
  kunto: z.string(),
});

export const locationQuerySchema = z.object({
  requestId: z.string(),
  location: z.string(),
  source: z.union([
    z.literal("donation"),
    z.literal("recycle"),
    z.literal("repair"),
  ]),
});
