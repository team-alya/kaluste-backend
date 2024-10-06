import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { PriceAnalysisResponse, NoReqIDResponse} from "../types";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const createPrompt = (furnitureDetails: NoReqIDResponse): string => `
  Description of the piece of furniture in the photo:

  The type of the furniture is ${furnitureDetails.type}. The maker of the furniture is ${furnitureDetails.brand} and its model is ${furnitureDetails.model}.
  The color of the furniture is ${furnitureDetails.color}. The approximate dimensions are ${furnitureDetails.dimensions.length}x${furnitureDetails.dimensions.width}x${furnitureDetails.dimensions.height} cm.
  The condition is ${furnitureDetails.condition}. The age is ${furnitureDetails.age} years.

  Provide a price estimate for my piece of furniture in the second-hand market, based on this description and the photo. The second-hand market is based in Finland.
  Return 3 prices and 1 description as a JSON object with the fields: highest_price, lowest_price, average_price, description, and price_suggestion.
  The price_suggestion should return what price is most likely to sell the item and the probability of selling it at that price. 
  Format the response as a consistent JSON object.

  Example response format:
  {
    "highest_price": high price in euros,
    "lowest_price": low price in euros,
    "average_price": average price in euros,
    "description": "The piece of furniture is in excellent condition and is a rare model.",
    "price_suggestion": "The chair is most likely to sell for around x euros with a x% probability."
  }
`;

const parsePriceResponse = (responseText: string): PriceAnalysisResponse => {
  const cleanedText = responseText
  .replace(/```json\n?|\n?```/g, "")
  .replace(/\s+/g, ' ')
  .trim(); 
  return JSON.parse(cleanedText) as PriceAnalysisResponse;
};

const analyzePriceEstimate = async (
  imageBase64: string, 
  furnitureDetails: NoReqIDResponse
): Promise<PriceAnalysisResponse | { error: string }> => {
  const prompt = createPrompt(furnitureDetails);

  try {
    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
    ]);

    const response = await result.response;
    const text = await response.text();

    const parsedResponse = parsePriceResponse(text);
    
    return parsedResponse;

  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred during price analysis." };
  }
};

export default analyzePriceEstimate;
