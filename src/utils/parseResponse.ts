import { ImageAnalysisResponse } from "../types";

// Middleware to parse AI model response by removing any markdown formatting before converting it to JSON (used for Gemini only)
export const parseResponse = (responseText: string): ImageAnalysisResponse => {
  const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleanedText);
};
