import { z } from "zod";

export const furnitureDetailsSchema = z.object({
  requestId: z.string(),
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

export const priceAnalysisSchema = z.object({
  requestId: z.string(),
  korkein_hinta: z.number(),
  alin_hinta: z.number(),
  myyntikanavat: z.array(z.string()),
});
