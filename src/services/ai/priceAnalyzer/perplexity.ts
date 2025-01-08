import { openai } from "@ai-sdk/openai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateObject, generateText } from "ai";
import dedent from "dedent";
import dotenv from "dotenv";
import {
  FurnitureDetails,
  PriceEstimation,
  priceEstimationSchema,
} from "../../../types/schemas";
dotenv.config();

const perplexity = createOpenAICompatible({
  name: "perplexity",
  headers: {
    Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
  },
  baseURL: "https://api.perplexity.ai/",
});

async function perplexityPrizeAnalyse(furnitureDetails: FurnitureDetails) {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("fi-FI", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const result = await generateText({
    model: perplexity("llama-3.1-sonar-large-128k-online"),
    prompt: `
      Analysoi tämän huonekalun hinta käytettyjen tavaroiden markkinoilla Suomessa.
      Analyysi tehty: ${formattedDate}

      TUOTETIEDOT:
      - Merkki: ${furnitureDetails.merkki}
      - Malli: ${furnitureDetails.malli}
      - Väri: ${furnitureDetails.vari}
      - Mitat: ${furnitureDetails.mitat.pituus}x${furnitureDetails.mitat.leveys}x${furnitureDetails.mitat.korkeus} cm
      - Materiaalit: ${furnitureDetails.materiaalit.join(", ")}
      - Kunto: ${furnitureDetails.kunto}

      Anna hinta-arvio huomioiden:
      1. Tuotteen ominaisuudet
      2. Nykyiset markkinahinnat Suomessa
      3. Tämänhetkinen markkinatilanne (${formattedDate})
    `,
    temperature: 0,
  });

  return result.text;
}

async function generatePriceObject(
  furnitureDetails: FurnitureDetails,
  perplexityAnalysis: string,
) {
  const result = await generateObject({
    model: openai("gpt-4o-2024-11-20"),
    schema: priceEstimationSchema,
    temperature: 0.5,
    system: dedent`
    Olet huonekalujen hinta-arvioija Suomen markkinoilla.
    Käytä annettua Perplexityn tuottamaa analyysiä hinta-arvion pohjana, jos se on järkevä.
    Jos annettu analyysi ei ole käyttökelpoinen, tee oma arvio tuotetietojen perusteella.
    Anna aina konkreettiset hinnat ja perustelut tuotteen ominaisuuksien pohjalta.
    `,
    prompt: dedent`
    TUOTETIEDOT:
    - Merkki: ${furnitureDetails.merkki}
    - Malli: ${furnitureDetails.malli}
    - Väri: ${furnitureDetails.vari}
    - Mitat: ${furnitureDetails.mitat.pituus}x${furnitureDetails.mitat.leveys}x${furnitureDetails.mitat.korkeus} cm
    - Materiaalit: ${furnitureDetails.materiaalit.join(", ")}
    - Kunto: ${furnitureDetails.kunto}

    Käytä Perplexityn analyysiä markkinahinnoista hinta-arvion apuna, jos se on käyttökelponen.
    Jos analyysi ei ole käyttökelpoinen, tee oma arvio tuotetietojen perusteella.
    Ole kriittinen ja perustele hinta-arviosi huolellisesti.

    <PERPLEXITY ANALYYSI>
    ${perplexityAnalysis}
    <PERPLEXITY ANALYYSI>

    Anna nyt analyysisi perustuen tuotetietoihin. Arvioi tuotteen hinta käytettyjen tavaroiden markkinoilla Suomessa. Olet itsenäinen hina-arvioija ja vastaat asiakkaalle myyjän näkökulmasta.
    Älä mainitse vastauksessa Perplexity-analyysin lähteenäsi.
    `,
  });

  return result.object;
}
export const analyzePrice = async (
  furnitureDetails: FurnitureDetails,
): Promise<PriceEstimation> => {
  try {
    const perplexityAnalysis = await perplexityPrizeAnalyse(furnitureDetails);
    console.log("perplexityAnalysis", perplexityAnalysis);

    const result = await generatePriceObject(
      furnitureDetails,
      perplexityAnalysis,
    );

    return result;
  } catch (error) {
    console.error("Error in price analysis:", error);
    throw error;
  }
};
