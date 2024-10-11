import { GoogleGenerativeAI } from "@google/generative-ai";
import { FurnitureDetails } from "../../utils/types";
import { GEMINI_API_KEY } from "../../utils/constants";
import { resizeImage } from "../../utils/resizeImage";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to create a prompt for the AI, including instructions
const createPrompt = () =>
  `
    Analyze the furniture in the image and provide the following information:
    - type: The category of furniture (e.g., chair, table, sofa)
    - brand: The manufacturer or designer of the furniture
    - model: The specific model name or number
    - color: The primary color of the furniture
    - dimensions: An object with length, width, and height in centimeters (do not include 'cm' in the values)
    - age: Estimated age in years (as a number)
    - condition: Overall state of the furniture (e.g., Excellent, Good, Fair, Poor)

    Respond with a JSON object.
    Ensure all text values start with a capital letter.
    Provide your best estimate for dimensions and age, even if not certain.
    Do not include any markdown formatting or additional explanation.
    If there's no furniture visible in the image, return an object with an 'error' field explaining this.

    Example response format:
      {
        "type": "Sofa",
        "brand": "West Elm",
        "model": "Hamilton",
        "color": "Gray",
        "dimensions": {
          "length": 218,
          "width": 94,
          "height": 90
        },
        "age": 3,
        "condition": "Excellent"
      }
  `;

const parseImageResponse = (responseText: string): FurnitureDetails => {
  const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleanedText) as FurnitureDetails;
};

// Function to analyze the provided image using Gemini model, extracting furniture details
const analyzeImageGemini = async (
  imagePath: Buffer
): Promise<FurnitureDetails | { error: string }> => {

  const prompt = createPrompt();
  try {
    // Get resized and optimized image
    const optimizedBase64Img = await resizeImage(imagePath);

    // Send image and prompt to Gemini for analysis
    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: "image/jpeg", data: optimizedBase64Img } },
    ]);

    // Ensure that a response was received
    if (!result) {
      throw new Error("No content returned from Gemini API");
    }

    // Parse the response
    const response = result.response;
    const text = response.text();

    const parsedResponse = parseImageResponse(text);

    return parsedResponse;
  } catch (error: unknown) {
    return {
      error: `An unexpected error occurred during image analysis. Message: ${
        (error as Error).message
      }`,
    };
  }
};

export default analyzeImageGemini;
