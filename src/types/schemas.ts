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
  merkki: z.string().describe("Huonekalun valmistajan nimi"),
  malli: z.string().describe("Huonekalun mallinimi"),
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

export const StrictfurnitureDetailsSchema = z
  .object({
    merkki: z
      .string()
      .describe(
        "Huonekalun virallinen valmistajan nimi. Jos et ole 100% varma, palauta tarkalleen 'Ei tiedossa'. On erittäin tärkeää palauttaa 'Ei tiedossa' arvaamisen sijaan.",
      ),
    malli: z
      .string()
      .describe(
        "Huonekalun tarkka mallinimi tai sarja. ÄLÄ MISSÄÄN NIMESSÄ ARVAA mallia - palauta aina 'Ei tiedossa' jos et ole TÄYSIN VARMA mallista. Monilla valmistajilla on samankaltaisia huonekaluja eri mallinimisinä.",
      ),
    vari: z.string(),
    mitat: z
      .object({
        pituus: z.number(),
        leveys: z.number(),
        korkeus: z.number(),
      })
      .describe(
        "Dimensions in centimeters. Provide your best estimate if uncertain.",
      ),
    materiaalit: z.array(z.string()),
    kunto: z
      .enum(kuntoOptions)
      .describe(
        "Condition assessment of the furniture. Choose the best evaluation from the list. With capitalized first letter.",
      ),
  })
  .describe(
    "If you are uncertain about any field, return 'Ei tiedossa'. Do not make guesses.",
  );

export const StrictfurnitureDetailsSchemaEn = z
  .object({
    merkki: z
      .string()
      .describe(
        "Official manufacturer name of the furniture. If you're not 100% sure, return exactly 'Ei tiedossa'. It's extremely important to return 'Ei tiedossa' instead of guessing.",
      ),
    malli: z
      .string()
      .describe(
        "Exact model name or series of the furniture. NEVER UNDER ANY CIRCUMSTANCES guess the model - always return 'Ei tiedossa' if you are not COMPLETELY CERTAIN about the model. Many manufacturers have similar furniture with different model names.",
      ),
    vari: z.string(),
    mitat: z
      .object({
        pituus: z.number(),
        leveys: z.number(),
        korkeus: z.number(),
      })
      .describe(
        "Dimensions in centimeters. Provide your best estimate if uncertain.",
      ),
    materiaalit: z.array(z.string()),
    kunto: z
      .enum(kuntoOptions)
      .describe(
        "Condition assessment of the furniture. Choose the best evaluation from the list. With capitalized first letter.",
      ),
  })
  .describe(
    "If you are uncertain about any field, return 'Ei tiedossa'. Do not make guesses.",
  );

export const StrictfurnitureDetailsSchemaGemini25Pro = z
  .object({
    merkki: z
      .string()
      .describe(
        "Official manufacturer name of the furniture. If you're not 100% sure, return exactly 'Ei tiedossa'. It's extremely important to return 'Ei tiedossa' instead of guessing.",
      ),
    malli: z
      .string()
      .describe(
        "EXTREMELY IMPORTANT: NEVER guess the model name under ANY circumstances. ALWAYS return 'Ei tiedossa' unless you are 100% CERTAIN of the EXACT model name. Many manufacturers have nearly identical furniture with different model names. Do NOT attempt to identify based on visual similarity alone. When in doubt - which should be most cases - return 'Ei tiedossa'. This is a critical requirement.",
      ),
    vari: z.string(),
    mitat: z
      .object({
        pituus: z.number(),
        leveys: z.number(),
        korkeus: z.number(),
      })
      .describe(
        "Dimensions in centimeters. Provide your best estimate if uncertain.",
      ),
    materiaalit: z.array(z.string()),
    kunto: z
      .enum(kuntoOptions)
      .describe(
        "Condition assessment of the furniture. Choose the best evaluation from the list. With capitalized first letter.",
      ),
  })
  .describe(
    "If you are uncertain about any field, return 'Ei tiedossa'. Do not make guesses. EXTREMELY IMPORTANT: NEVER guess the model name under ANY circumstances.",
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
