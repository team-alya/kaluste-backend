import dedent from "dedent";
import {
  FurnitureDetails,
  PriceAnalysisResponse,
  ToriPrices,
} from "../../utils/types";
import imageServiceOpenAI from "./imageService";
import openai from "../../configs/openai";
import { priceAnalysisSchema } from "../../utils/schemas";
import getAvgPricesPerCondition from "../Tori/toriScraper";

// TODO: Add error field to prompt to be displayed when Tori.fi prices aren't found

const createPrompt = (
  furnitureDetails: FurnitureDetails,
  toriPrices: ToriPrices
) => dedent`
  # HUONEKALUN HINTA-ARVIOPYYNTÖ 
  requestId: ${furnitureDetails.requestId}

  ## HUONEKALUN TIEDOT
  - Valmistaja: ${furnitureDetails.merkki}
  - Malli: ${furnitureDetails.malli}
  - Väri: ${furnitureDetails.väri}
  - Mitat: ${furnitureDetails.mitat.pituus}x${furnitureDetails.mitat.leveys}x${
  furnitureDetails.mitat.korkeus
} cm
  - Materiaalit: ${furnitureDetails.materiaalit}
  - Kunto: ${furnitureDetails.kunto}

  ## TARKAT TORI.FI MARKKINATIEDOT
  Ajantasaiset Tori.fi markkinatilastot tämän tyyppiselle huonekalulle:
  ${JSON.stringify(toriPrices, null, 2)}
  TÄRKEÄÄ: Kopio nämä tarkat arvot vastauksen kohtaan tori_hinnat.

  ## VAADITTU LOPPUTULOS
  Anna hinta-arvio JSON näiden vaatimusten perusteella:
  1. Käytä tori_hinnat kohdassa annettua Tori.fi dataa (jos dataa ei ole saatavilla älä palauta mitään tori_hintoihin)
  2. Anna hinta-arvio huonekalulle käytettyjen tavaroiden markkinoilla annetun kuvauksen ja kuvan perusteella. Kyseessä olevat käytettyjen tavaroiden markkinat sijaitsevat Suomessa.
  3. Vastauksen muodon tulee olla: 
  {
    "requestId": "${furnitureDetails.requestId}",
    "korkein_hinta": <korkein hinta euroina>,
    "alin_hinta": <alin hinta euroina>,
    "myyntikanavat": <lista myyntikanavista>
    "tori_hinnat": {
      <kunto>: [<keskiarvoinen_hinta>, <kappalemäärä>]
  }

  ## VALIDAATIOSÄÄNNÖT
  1. Kaikki hinnat tulee olla euroina
  2. tori_hinnat tulee vastata annettua Tori.fi dataa
`;

const analyzePrice = async (
  furnitureDetails: FurnitureDetails
): Promise<PriceAnalysisResponse | { error: string }> => {
  const context =
    imageServiceOpenAI.conversationHistory[furnitureDetails.requestId];

  context.furnitureDetails = furnitureDetails;

  if (!context.imageUrl) {
    return { error: "No valid image content found in context" };
  }

  const base64ImgUrl: string = context.imageUrl;

  const toriPrices = await getAvgPricesPerCondition(
    furnitureDetails.merkki,
    furnitureDetails.malli
  );

  const prompt = !("error" in toriPrices)
    ? createPrompt(furnitureDetails, toriPrices)
    : createPrompt(furnitureDetails, {});

  try {
    const result = await openai.client.chat.completions.create({
      model: openai.model,
      messages: [
        {
          role: "system",
          content: "You are a furniture price analysis assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: base64ImgUrl,
                detail: "auto",
              },
            },
          ],
        },
      ],
      response_format: { type: "json_object" },
    });

    const responseContent = result.choices[0].message.content;

    if (responseContent === null) {
      throw new Error("Error analyzing price");
    }

    const parsedResponse = priceAnalysisSchema.parse(
      JSON.parse(responseContent)
    );
    context.price = parsedResponse;

    context.messages.push({
      role: "assistant",
      content: responseContent,
    });

    return parsedResponse;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "An unknown error occurred while analyzing price" };
    }
  }
};

export default analyzePrice;
