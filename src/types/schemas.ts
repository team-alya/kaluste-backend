import { z } from "zod";

export const kuntoOptions = [
  "Uusi",
  "Erinomainen",
  "Hyvä",
  "Kohtalainen",
  "Huono",
] as const;

export const furnitureDetailsSchema = z.object({
  merkki: z
    .string()
    .describe(
      "Huonekalun valmistajan nimi tai tyylisuunta. Jos kyseessä on vintage-kaluste tai et tunnista tarkkaa valmistajaa, voit kuvailla tyyliä esim. 'Vintage Scandinavian', 'Mid-century Modern', 'Danish Modern', 'Finnish Design 1960s', 'Bauhaus Style'. Tunnettujen valmistajien kohdalla palauta valmistajan nimi (esim. Isku, Martela, Artek, Asko, IKEA). Jos et pysty tunnistamaan merkkiä tai tyyliä varmuudella, palauta 'Ei tiedossa'.",
    ),
  malli: z
    .string()
    .describe(
      "Huonekalun mallinimi, sarja tai tyylillinen kuvaus. Voi olla tarkka mallisarja (esim. 'Kilta', 'Mondo') tai kuvaileva määritelmä vintage-kalusteelle (esim. 'Teak Dining Chair 1960s', 'Danish Style Lounge Chair', 'Bauhaus Style Office Chair'). Jos mallia ei voi tunnistaa varmuudella, palauta 'Ei tiedossa'.",
    ),
  väri: z.string(),
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
    .describe("Huonekalun kuntoarvio. Valitse paras arvio."),
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
    .describe("Lista suositelluista myyntipaikoista"),
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

export type PriceAnalysisResponse = z.infer<typeof priceAnalysisSchema>;
export type FurnitureDetails = z.infer<typeof furnitureDetailsSchema>;
