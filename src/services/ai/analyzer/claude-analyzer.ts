import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import dotenv from "dotenv";
import { analyzeImagePrompt } from "../../../prompts/prompts";
import { imgAnalyzeSystemMsg } from "../../../prompts/system";
import { AIAnalyzer, AnalyzerResult } from "../../../types/analyzer";
import { furnitureDetailsSchema } from "../../../types/schemas";

dotenv.config();

export class ClaudeAnalyzer implements AIAnalyzer {
  name = "CLAUDE-3-5-SONNET";

  async analyze(imageBuffer: Buffer): Promise<AnalyzerResult> {
    try {
      const result = await generateObject({
        model: anthropic("claude-3-5-sonnet-20240620"),
        schema: furnitureDetailsSchema,
        output: "object",
        system: imgAnalyzeSystemMsg,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: analyzeImagePrompt,
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
  //     merkki: "Martella",
  //     malli: "",
  //     vari: "musta,punainen,vihreä",
  //     mitat: {
  //       pituus: 6,
  //       leveys: 6,
  //       korkeus: 6,
  //     },
  //     materiaalit: ["puu"],
  //     kunto: "Uusi",
  //   });
  // }
}
