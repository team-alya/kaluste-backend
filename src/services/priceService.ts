import { GoogleGenerativeAI } from "@google/generative-ai";
import { PriceAnalysisResponse, FurnitureDetails} from "../types";
import { GEMINI_API_KEY } from "../utils/constants";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const createPrompt = (furnitureDetails: FurnitureDetails) => `
  Description of the piece of furniture in the photo:

  The type of the furniture is ${furnitureDetails.type}. The maker of the furniture is ${furnitureDetails.brand} and its model is ${furnitureDetails.model}.
  The color of the furniture is ${furnitureDetails.color}. The approximate dimensions are ${furnitureDetails.dimensions.length}x${furnitureDetails.dimensions.width}x${furnitureDetails.dimensions.height} cm.
  The condition is ${furnitureDetails.condition}. The age is ${furnitureDetails.age} years.

  Provide a price estimate for my piece of furniture in the second-hand market, based on this description and the photo. The second-hand market is based in Finland.
  Return 3 prices and 1 description as a JSON object with the fields: highest_price, lowest_price, average_price, description, and sell_probability.
  The sell_probability should estimate how probable the item will sell and which price is most likely to succeed. Format the response as a consistent JSON object.
`;

const parsePriceResponse = (responseText: string) => {
  const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleanedText) as PriceAnalysisResponse;
};

const analyzePriceEstimate = async (imageBase64: string, furnitureDetails: FurnitureDetails) => {
  const prompt = createPrompt(furnitureDetails);

  try {
    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
    ]);
    const response = result.response;
    const text = response.text();

    const parsedResponse = parsePriceResponse(text);
    
    return parsedResponse;

  } catch (error) {
    return { error: "An unexpected error occurred during price analysis." };
  }
};

export default analyzePriceEstimate;
