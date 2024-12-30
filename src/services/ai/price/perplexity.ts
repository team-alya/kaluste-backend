import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { generateObject } from "ai";
import { FurnitureDetails, priceAnalysisSchema } from "../../../types/schemas";

const perplexity = createOpenAICompatible({
  name: "perplexity",
  headers: {
    Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
  },
  baseURL: "https://api.perplexity.ai/",
});

export const analyzePrice = async (furnitureDetails: FurnitureDetails) => {
  return "Price analysis result";
  try {
    const result = await generateObject({
      model: perplexity("llama-3.1-sonar-large-32k-online"),
      schema: priceAnalysisSchema,
      temperature: 0,
      messages: [
        {
          role: "system",
          content: "Olet huonekalujen hinta-analysoija Suomen markkinoilla.",
        },
        {
          role: "user",
          content: `
              Analysoi tämän huonekalun hinta käytettyjen tavaroiden markkinoilla:
              - Merkki: ${furnitureDetails.merkki}
              - Malli: ${furnitureDetails.malli}
              - Väri: ${furnitureDetails.vari}
              - Mitat: ${furnitureDetails.mitat.pituus}x${furnitureDetails.mitat.leveys}x${furnitureDetails.mitat.korkeus} cm
              - Materiaalit: ${furnitureDetails.materiaalit.join(", ")}
              - Kunto: ${furnitureDetails.kunto}
              
              Anna hinta-arvio huomioiden tuotteen ominaisuudet ja nykyiset markkinahinnat Suomessa.
            `,
        },
      ],
    });
    console.log("result", result.object);
    return result.object;
  } catch (error) {
    console.error("Error in price analysis:", error);
    throw error;
  }
};
