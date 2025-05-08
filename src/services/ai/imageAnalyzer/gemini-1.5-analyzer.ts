import {
  FurnitureDetails,
  furnitureDetailsSchemaGemini15,
} from "@/types/schemas";
import { AIAnalyzer } from "@/types/services";
import { AnalysisTimer } from "@/utils/timer";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import dotenv from "dotenv";
import { analyzeImagePromptGemini15 } from "../prompts/prompts";
import { imgAnalyzeSystemMsgGemini1_5 } from "../prompts/system";
dotenv.config();

export class Gemini_1_5_Analyzer implements AIAnalyzer {
  name = "Gemini-1.5";
  async analyze(imageBuffer: Buffer): Promise<FurnitureDetails> {
    try {
      const timer = new AnalysisTimer(this.name);
      
      const result = await generateObject({
        model: google("gemini-1.5-pro-latest", {
          useSearchGrounding: true,
        }),
        schema: furnitureDetailsSchemaGemini15,
        output: "object",
        system: imgAnalyzeSystemMsgGemini1_5,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: analyzeImagePromptGemini15,
              },
              {
                type: "image",
                image: imageBuffer,
              },
            ],
          },
        ],
      });
      const mapped: FurnitureDetails = {
        ...result.object,
        kunto: result.object.kunto as FurnitureDetails["kunto"], // We have to do this because Gemnini 1.5 returns random kunto value sometimes. Like "Käytetty" that is not in the schema.
      };
      
      timer.stop(mapped.merkki, mapped.malli);
      return mapped;
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
  //       pituus: 6,
  //       leveys: 6,
  //       korkeus: 6,
  //     },
  //     materiaalit: ["kivi"],
  //     kunto: "Uudenveroinen",
  //   });
  // }
}
