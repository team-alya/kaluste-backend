import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { parseResponse } from "../utils/parseResponse";
import { ImageAnalysisResponse } from "../types";
import { resizeImage } from "../utils/resizeImage";

dotenv.config();

// Load API-key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables");
}

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Function to create a prompt for the AI, including the request_id and instructions
const createPrompt = (requestId: string) =>
  `
    Request ID: ${requestId}

    Analyze the furniture in the image and provide the following information:
    - type: The category of furniture (e.g., chair, table, sofa)
    - brand: The manufacturer or designer of the furniture
    - model: The specific model name or number
    - color: The primary color of the furniture
    - dimensions: An object with length, width, and height in centimeters (do not include 'cm' in the values)
    - age: Estimated age in years (as a number)
    - condition: Overall state of the furniture (e.g., Excellent, Good, Fair, Poor)

    Respond with a JSON object. The first field should be request_id.
    Ensure all text values start with a capital letter.
    Do not include any markdown formatting or additional explanation.
    If there's no furniture visible in the image, return an object with an 'error' field explaining this.

    Example response format:
    {
      "request_id": "${requestId}",
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

// Function to analyze the provided image using Gemini model, extracting furniture details
const analyzeImageGemini = async (
  imagePath: Buffer
): Promise<ImageAnalysisResponse | { error: string }> => {
  const requestId = uuidv4();
  const prompt = createPrompt(requestId);
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
    const parsedResponse: any = parseResponse(text);

    return parsedResponse;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "An unexpected error occurred during image analysis." };
    }
  }
};

export default analyzeImageGemini;
