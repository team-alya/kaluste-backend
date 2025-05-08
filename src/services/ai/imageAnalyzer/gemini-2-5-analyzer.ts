import {
  FurnitureDetails,
  StrictfurnitureDetailsSchemaGemini25Pro,
} from "@/types/schemas";
import { AIAnalyzer } from "@/types/services";
import { AnalysisTimer } from "@/utils/timer";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import dotenv from "dotenv";
import { analyzeImagePromptEnglish } from "../prompts/prompts";
dotenv.config();

export class GeminiAnalyzer implements AIAnalyzer {
  name = "Gemini-2.5";
  async analyze(imageBuffer: Buffer): Promise<FurnitureDetails> {
    try {
      const timer = new AnalysisTimer(this.name);

      const result = await generateObject({
        model: google("gemini-2.5-flash-preview-04-17", {
          useSearchGrounding: true,
        }),
        schema: StrictfurnitureDetailsSchemaGemini25Pro,
        // Dont use system message for Gemini-2.5 - With system message it start guessing brand and model idk why
        output: "object",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: analyzeImagePromptEnglish,
              },
              {
                type: "image",
                image: imageBuffer,
              },
            ],
          },
        ],
      });

      timer.stop(result.object.merkki, result.object.malli);
      return result.object;
    } catch (error) {
      const timer = new AnalysisTimer(this.name);
      timer.logError(error);
      throw error;
    }
  }

  // async analyze(_imageBuffer: Buffer): Promise<FurnitureDetails> {
  //   // await sleep(4000);
  //   return Promise.resolve({
  //     merkki: "Martella",
  //     malli: "",
  //     vari: "keltainen",
  //     mitat: {
  //       pituus: 2,
  //       leveys: 2,
  //       korkeus: 2,
  //     },
  //     materiaalit: ["kivi"],
  //     kunto: "Uusi",
  //   });
  // }
}
