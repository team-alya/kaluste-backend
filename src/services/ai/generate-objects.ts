import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { FurnitureDetails, priceAnalysisSchema } from "../../types/schemas";
import getAvgPricesPerCondition from "../tori/toriScraper";

const analyzePrice = async (furnitureDetails: FurnitureDetails) => {
  try {
    const toriPrices = await getAvgPricesPerCondition(
      furnitureDetails.merkki,
      furnitureDetails.malli,
    );
    console.log("toriPrices", toriPrices);

    const result = await generateObject({
      model: openai("gpt-4o-2024-11-20"),
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
            
            Tori.fi:stä löydetyt vertailuhinnat:
            ${JSON.stringify(toriPrices, null, 2)}

            Anna konkreettinen hinta-arvio huomioiden:
            1. Annetut Tori.fi vertailuhinnat
            2. Tuotteen kunto ja ominaisuudet
            3. Nykyiset markkinahinnat Suomessa
          `,
        },
      ],
    });

    return result.object;
  } catch (error) {
    console.error("Error in price analysis:", error);
    throw error;
  }
};

export default {
  analyzePrice,
};
