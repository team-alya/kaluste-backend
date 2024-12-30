import { z } from "zod";

export const kuntoOptions = [
  "uusi",
  "erinomainen",
  "hyvä",
  "kohtalainen",
  "huono",
  "ei tiedossa",
] as const;

export const furnitureDetailsSchema = z.object({
  merkki: z
    .string()
    .describe(
      "Huonekalun valmistajan nimi tai tyylisuunta. Tunnettujen valmistajien kohdalla palauta valmistajan nimi (esim. Isku, Martela, Artek, Asko, IKEA). Jos et pysty tunnistamaan merkkiä tai tyyliä varmuudella, palauta 'Ei tiedossa'.",
    ),
  malli: z
    .string()
    .describe(
      "Huonekalun mallinimi, sarja tai tyylillinen kuvaus. Voi olla tarkka mallisarja (esim. 'Kilta', 'Mondo'). Jos mallia ei voi tunnistaa varmuudella, palauta 'Ei tiedossa'.",
    ),
  vari: z.string(),
  mitat: z
    .object({
      pituus: z.number(),
      leveys: z.number(),
      korkeus: z.number(),
    })
    .describe("Mitat senttimetreinä. Anna paras arviosi, jos et ole varma."),
  materiaalit: z.array(z.string()),
  kunto: z
    .enum(kuntoOptions)
    .describe("Huonekalun kuntoarvio. Valitse paras arvio listalta."),
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
  korkein_hinta: z
    .number()
    .min(0)
    .max(1000000)
    .describe("Suurin realistinen myyntihinta euroina"),
  alin_hinta: z
    .number()
    .min(0)
    .max(1000000)
    .describe("Alin realistinen myyntihinta euroina"),
  myyntikanavat: z
    .array(z.string())
    .describe("Lista suositelluista suomalaisista myyntipaikoista"),
});

export const chatResponseSchema = z.object({
  requestId: z.string(),
  answer: z.string(),
});

export const reviewSchema = z.object({
  requestId: z.string(),
  review: z.object({
    rating: z
      .number()
      .min(1, { message: "Rating must be between 1 and 5" })
      .max(5, { message: "Rating must be between 1 and 5" }),
    comment: z.string().optional(),
  }),
});

export type PriceAnalysis = z.infer<typeof priceAnalysisSchema>;
export type FurnitureDetails = z.infer<typeof furnitureDetailsSchema>;
