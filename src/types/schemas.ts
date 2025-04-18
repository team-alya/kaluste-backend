import { z } from "zod";

export const kuntoOptions = [
  "Uusi",
  "Erinomainen",
  "Hyvä",
  "Kohtalainen",
  "Huono",
  "Ei tiedossa",
] as const;

export const furnitureDetailsSchema = z
  .object({
    merkki: z
      .string()
      .describe(
        "Huonekalun valmistajan nimi tai tyylisuunta. Tunnettujen valmistajien kohdalla palauta valmistajan nimi (esim. Isku, Martela, Artek, Asko, IKEA). Jos et pysty tunnistamaan merkkiä tai tyyliä varmuudella, palauta 'Ei tiedossa'.",
      ),
    malli: z
      .string()
      .describe(
        "Huonekalun mallinimi, sarja tai tyylillinen kuvaus. Voi olla tarkka mallisarja (esim. 'Kilta', 'Mondo'). Jos mallia ei voi tunnistaa varmuudella, palauta 'Ei tiedossa'. Älä arvaa.",
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
  })
  .describe(
    "Jos et ole varma jostain kentästä, palauta 'Ei tiedossa'. Älä arvaa.",
  );

export const furnitureDetailsSchemaGemini15 = z.object({
  merkki: z
    .string()
    .describe(
      "Huonekalun valmistajan nimi tai tyylisuunta. Tunnettujen valmistajien kohdalla palauta valmistajan nimi (esim. Isku, Martela, Artek, Asko, IKEA). Jos et pysty tunnistamaan merkkiä tai tyyliä varmuudella, palauta 'Ei tiedossa'. Älä arvaa.",
    ),
  malli: z
    .string()
    .describe(
      "Palauta 'Ei tiedossa' ellet ole täysin varma mallista. Ole tarkka mallin kanssa. Esim valmistajan huonekaluja voi olla monia samanlaisia joten palauta 'Ei tiedossa' jos olet epävarma",
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
    .string()
    .describe(
      "Huonekalun kuntoarvio. Valitse paras arvio seuraavista vaihtoehdoista: Uusi, Erinomainen, Hyvä, Kohtalainen, Huono, Ei tiedossa. Isolla alkukirjaimella.",
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
