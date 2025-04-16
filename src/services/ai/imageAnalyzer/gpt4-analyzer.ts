import { FurnitureDetails, furnitureDetailsSchema } from "@/types/schemas";
import { AIAnalyzer } from "@/types/services";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import dotenv from "dotenv";
import { analyzeImagePromptGPT4o } from "../prompts/prompts";
import { imgAnalyzeSystemMsg } from "../prompts/system";
dotenv.config();

export class GPT4Analyzer implements AIAnalyzer {
  name = "GPT-4.1";
  async analyze(imageBuffer: Buffer): Promise<FurnitureDetails> {
    try {
      const result = await generateObject({
        model: openai("gpt-4.1-2025-04-14"),
        schema: furnitureDetailsSchema,
        output: "object",
        system: imgAnalyzeSystemMsg,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: analyzeImagePromptGPT4o,
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
  }

  // analyze(_imageBuffer: Buffer): Promise<FurnitureDetails> {
  //   return Promise.resolve({
  //     merkki: "Isku",
  //     malli: "",
  //     vari: "musta,punainen",
  //     mitat: {
  //       pituus: 5,
  //       leveys: 4,
  //       korkeus: 4,
  //     },
  //     materiaalit: ["kivi"],
  //     kunto: "Uusi",
  //   });
  // }
}
