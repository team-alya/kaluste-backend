import { FurnitureDetails, PriceAnalysisResponse } from "../../utils/types";
import openai from "../../configs/openai";
import { priceAnalysisSchema } from "../../utils/schemas";
import getAvgPricesPerCondition from "../Tori/toriScraper";
import { createPricePrompt } from "../../prompts/prompts";
import conversationHistory from "../../context/conversations";

/**
 * Analyze price of the furniture.
 */
const analyzePrice = async (
  furnitureDetails: FurnitureDetails,
): Promise<PriceAnalysisResponse | { error: string }> => {
  const context = conversationHistory[furnitureDetails.requestId];
  const requestId = furnitureDetails.requestId;

  context.furnitureDetails = furnitureDetails;

  if (!context.imageUrl) {
    return { error: "No valid image content found in context" };
  }

  const base64ImgUrl: string = context.imageUrl;

  const toriPrices = await getAvgPricesPerCondition(
    furnitureDetails.merkki,
    furnitureDetails.malli,
  );

  const prompt = !("error" in toriPrices)
    ? createPricePrompt(furnitureDetails, toriPrices)
    : createPricePrompt(furnitureDetails, {});

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
      JSON.parse(responseContent),
    );
    const priceAnalysisResponseWithId: PriceAnalysisResponse = {
      requestId,
      korkein_hinta: parsedResponse.korkein_hinta,
      alin_hinta: parsedResponse.alin_hinta,
      myyntikanavat: parsedResponse.myyntikanavat,
      tori_hinnat: parsedResponse.tori_hinnat,
    };
    context.price = priceAnalysisResponseWithId;

    context.messages.push({
      role: "assistant",
      content: responseContent,
    });

    return priceAnalysisResponseWithId;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "An unknown error occurred while analyzing price" };
    }
  }
};

export default analyzePrice;
