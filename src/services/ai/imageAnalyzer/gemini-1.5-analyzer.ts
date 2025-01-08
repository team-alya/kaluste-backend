import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import dotenv from "dotenv";
import { analyzeImagePrompt } from "../../../prompts/prompts";
import { imgAnalyzeSystemMsg } from "../../../prompts/system";
import { AIAnalyzer, AnalyzerResult } from "../../../types/analyzer";
import { furnitureDetailsSchemaGemini15 } from "../../../types/schemas";
dotenv.config();
export class Gemini_1_5_Analyzer implements AIAnalyzer {
  name = "Gemini";
  async analyze(imageBuffer: Buffer): Promise<AnalyzerResult> {
    try {
      const result = await generateObject({
        model: google("gemini-1.5-pro-latest", {
          useSearchGrounding: true,
        }),
        // model: google("gemini-1.5-pro-latest"),
        schema: furnitureDetailsSchemaGemini15,
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
  //     kunto: "Uudenveroinen",
  //   });
  // }
}
