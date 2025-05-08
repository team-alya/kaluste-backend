import {
  FurnitureDetails,
  StrictfurnitureDetailsSchema,
} from "@/types/schemas";
import { AIAnalyzer } from "@/types/services";
import { AnalysisTimer } from "@/utils/timer";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject } from "ai";
import dotenv from "dotenv";
import { analyzeImagePrompt } from "../prompts/prompts";
import { imgAnalyzeSystemMsgStrict } from "../prompts/system";

dotenv.config();

export class ClaudeAnalyzer implements AIAnalyzer {
  name = "CLAUDE-3-7-SONNET";

  async analyze(imageBuffer: Buffer): Promise<FurnitureDetails> {
    try {
      const timer = new AnalysisTimer(this.name);

      const result = await generateObject({
        model: anthropic("claude-3-7-sonnet-latest"),
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
  //     merkki: "",
  //     malli: "",
  //     vari: "musta,punainen,vihreä",
  //     mitat: {
  //       pituus: 5,
  //       leveys: 4,
  //       korkeus: 4,
  //     },
  //     materiaalit: ["puu"],
  //     kunto: "Uusi",
  //   });
  // }
}
