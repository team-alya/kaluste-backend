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

export const locationQuerySchema = z.object({
  requestId: z.string(),
  location: z.string(),
  source: z.union([
    z.literal("donation"),
    z.literal("recycle"),
    z.literal("repair"),
  ]),
});

export const priceAnalysisSchema = z.object({
  requestId: z.string(),
  korkein_hinta: z.number(),
  alin_hinta: z.number(),
  myyntikanavat: z.array(z.string()),
  tori_hinnat: z.record(z.string(), z.tuple([z.number(), z.number()])),
});

export const chatResponseSchema = z.object({
  requestId: z.string(),
  answer: z.string(),
});

export const reviewSchema = z.object({
  requestId: z.string(),
  review: z.object({
    rating: z.number()
      .min(1, { message: "Rating must be between 1 and 5" })
      .max(5, { message: "Rating must be between 1 and 5" }),
    comment: z.string().optional(),
  }),
});