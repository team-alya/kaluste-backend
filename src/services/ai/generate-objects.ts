import { FurnitureDetails, furnitureDetailsSchema } from "@/types/schemas";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import dotenv from "dotenv";
import { finalAnalyzePromptGPT4o } from "./prompts/prompts";
import {
  finalImgAnalyzeSystemMsg
} from "./prompts/system";
dotenv.config();

export const finalAnalyze = async (
  imageBuffer: Buffer
): Promise<FurnitureDetails> => {
  try {
    const result = await generateObject({
      model: openai("gpt-4o-2024-11-20"),
      schema: furnitureDetailsSchema,
      output: "object",
      system: finalImgAnalyzeSystemMsg,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: finalAnalyzePromptGPT4o,
            },
            {
              type: "image",
              image: imageBuffer,
            },
          ],
        },
      ],
    });
    return result.object;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};
