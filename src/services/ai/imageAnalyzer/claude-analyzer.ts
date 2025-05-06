import {
  FurnitureDetails,
  StrictfurnitureDetailsSchema,
} from "@/types/schemas";
import { AIAnalyzer } from "@/types/services";
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
      const startTime = Date.now();
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Starting ${this.name} analysis...`);

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

      const endTime = Date.now();
      const duration = endTime - startTime;
      const durationSeconds = (duration / 1000).toFixed(2) + "s";
      const timestampEnd = new Date().toISOString();
      console.log(
        `[${timestampEnd}] ${this.name} completed in ${durationSeconds}`,
      );
      console.log(
        `[${timestampEnd}] ${this.name} detected brand: "${result.object.merkki}"`,
      );
      console.log(
        `[${timestampEnd}] ${this.name} detected model: "${result.object.malli}"`,
      );

      return result.object;
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] Error in ${this.name} analysis:`, error);
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
