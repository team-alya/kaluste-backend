import {
  FurnitureDetails,
  StrictfurnitureDetailsSchema,
} from "@/types/schemas";
import { AIAnalyzer } from "@/types/services";
import { AnalysisTimer } from "@/utils/timer";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import dotenv from "dotenv";
import { analyzeImagePrompt } from "../prompts/prompts";
import { imgAnalyzeSystemMsgStrict } from "../prompts/system";
dotenv.config();

export class GPT4Analyzer implements AIAnalyzer {
  name = "GPT-4.1";
  async analyze(imageBuffer: Buffer): Promise<FurnitureDetails> {
    try {
      const timer = new AnalysisTimer(this.name);

      const result = await generateObject({
        model: openai("gpt-4.1-2025-04-14"),
        schema: StrictfurnitureDetailsSchema,
        output: "object",
        system: imgAnalyzeSystemMsgStrict,
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

      timer.stop(result.object.merkki, result.object.malli);
      return result.object;
    } catch (error) {
      const timer = new AnalysisTimer(this.name);
      timer.logError(error);
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
