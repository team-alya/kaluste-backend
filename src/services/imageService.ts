import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
console.log("GEMINI_API_KEY", GEMINI_API_KEY);

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const analyzeImage = async (imagePath: string) => {
  console.log("imagePath", imagePath);

  try {
    const imageBytes = fs.readFileSync(imagePath);
    console.log("imageBytes", imageBytes);

    const requestId = uuidv4();

    /*
    Suunnilleen sama kuin vanhan ryhmän käyttämä prompt. Tätä kannattaa muokata ja pääsee helpommalla käyttäen Structured output palautusta. 
    Muokattava omien tarpeiden mukaan paremmaksi. https://www.promptingguide.ai/fi
    */

    const prompt = `
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

    const imageBase64 = imageBytes.toString("base64");
    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
    ]);
    const response = result.response;
    const text = response.text();

    // Remove any potential markdown formatting
    const cleanedText = text.replace(/```json\n?|\n?```/g, "").trim();

    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("Failed to parse JSON:", cleanedText);
      return {
        error: "Failed to parse the response from the AI model.",
        raw_response: cleanedText,
      };
    }
  } catch (error) {
    console.error("An error occurred during image analysis:", error);
    return { error: "An unexpected error occurred during image analysis." };
  }
};

// Testi dataa voi kovakoodata palautuksen jotta API:n toimintaa voi testata eikä sitä kuluteta turhaan
export function getExampleFurnitureData() {
  return {
    request_id: uuidv4(),
    type: "Sofa",
    brand: "West Elm",
    model: "Hamilton",
    color: "Gray",
    dimensions: {
      length: 218,
      width: 94,
      height: 90,
    },
    age: 3,
    condition: "Excellent",
  };
}

export default analyzeImage;
