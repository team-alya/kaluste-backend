import { z } from "zod";

export const kuntoOptions = [
  "Uusi",
  "Erinomainen",
  "Hyvä",
  "Kohtalainen",
  "Huono",
  "Ei tiedossa",
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
    .describe(
      "Huonekalun kuntoarvio. Valitse paras arvio listalta. Isolla alkukirjaimella.",
    ),
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

  perustelu: z
    .array(z.string())
    .min(1)
    .max(3)
    .describe(
      "Huonekalun hinta-arvio perusteltuna asiakkaalle myyjän näkökulmasta lyhyesti ja ytimekkäästi. Älä mainitse triviaaleja asioita huonekalusta, jotka asikas tietää jo. Älä mainitse Perplexityä-analyysin lähteenäsi. ",
    ),
});

export const priceEstimationSchema = z.object({
  korkein_hinta: z.number().describe("Suurin realistinen myyntihinta euroina"),

  alin_hinta: z.number().describe("Alin realistinen myyntihinta euroina"),

  suositus_hinta: z
    .number()
    .min(0)
    .max(1000000)
    .describe("Suositeltu optimaalinen myyntihinta euroina"),

  arvioitu_myyntiaika: z
    .object({
      nopea: z
        .number()
        .min(1)
        .max(365)
        .describe("Arvioitu myyntiaika päivissä alimmalla hinnalla"),
      normaali: z
        .number()
        .min(1)
        .max(365)
        .describe("Arvioitu myyntiaika päivissä suositushinnalla"),
      hidas: z
        .number()
        .min(1)
        .max(365)
        .describe("Arvioitu myyntiaika päivissä korkeimmalla hinnalla"),
    })
    .describe("Arviot myyntiajasta eri hintaluokissa"),

  myyntikanavat: z
    .array(z.string())
    .describe("Lista suositelluista suomalaisista myyntipaikoista"),

  perustelu: z
    .array(z.string())
    .describe(
      "Lyhyt ja ytimekäs perustelu hinta-arviolle. Älä toista perustiedoissa mainittuja asioita. Älä mainitse Perplexityä-analyysin lähteenäsi.",
    ),

  markkinatilanne: z
    .object({
      kysyntä: z.string().describe("Arvio kysynnästä (korkea/normaali/matala)"),
      kilpailu: z
        .number()
        .min(0)
        .max(100)
        .describe("Arvio kilpailevien ilmoitusten määrästä"),
      sesonki: z.boolean().describe("Onko tuotteella nyt sesonki"),
    })
    .describe("Arvio markkinatilanteesta"),
});

export type PriceEstimation = z.infer<typeof priceEstimationSchema>;
export type PriceAnalysis = z.infer<typeof priceAnalysisSchema>;
export type FurnitureDetails = z.infer<typeof furnitureDetailsSchema>;

/*
Vanhoja schemoja opiskelijoiden projekteista.
TODO: Poista, jos ei tarvita.
*/
export const locationQuerySchema = z.object({
  requestId: z.string(),
  location: z.string(),
  source: z.union([
    z.literal("donation"),
    z.literal("recycle"),
    z.literal("repair"),
  ]),
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
