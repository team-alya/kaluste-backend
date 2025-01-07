import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import dotenv from "dotenv";
import { analyzeImagePromptGPT4o } from "../../../prompts/prompts";
import { imgAnalyzeSystemMsg } from "../../../prompts/system";
import { AIAnalyzer, AnalyzerResult } from "../../../types/analyzer";
import { furnitureDetailsSchema } from "../../../types/schemas";
dotenv.config();

export class GPT4Analyzer implements AIAnalyzer {
  name = "GPT-4";
  async analyze(imageBuffer: Buffer): Promise<AnalyzerResult> {
    try {
      const result = await generateObject({
        model: openai("gpt-4o"),
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

  // analyze(_imageBuffer: Buffer): Promise<AnalyzerResult> {
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
