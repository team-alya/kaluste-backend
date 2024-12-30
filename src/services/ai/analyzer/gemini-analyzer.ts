import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import dotenv from "dotenv";
import { analyzeImagePrompt } from "../../../prompts/prompts";
import { imgAnalyzeSystemMsg } from "../../../prompts/system";
import { AIAnalyzer, AnalyzerResult } from "../../../types/analyzer";
import { furnitureDetailsSchema } from "../../../types/schemas";
dotenv.config();
export class GeminiAnalyzer implements AIAnalyzer {
  name = "Gemini";
  async analyze(imageBuffer: Buffer): Promise<AnalyzerResult> {
    try {
      const result = await generateObject({
        model: google("gemini-2.0-flash-exp"),
        // model: google("gemini-1.5-pro-latest"),
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

  // async analyze(_imageBuffer: Buffer): Promise<AnalyzerResult> {
  //   // await sleep(4000);
  //   return Promise.resolve({
  //     merkki: "Martella",
  //     malli: "",
  //     vari: "keltainen",
  //     mitat: {
  //       pituus: 6,
  //       leveys: 6,
  //       korkeus: 6,
  //     },
  //     materiaalit: ["kivi"],
  //     kunto: "uudenveroinen",
  //   });
  // }
}
