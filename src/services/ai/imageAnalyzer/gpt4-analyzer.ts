import { FurnitureDetails, furnitureDetailsSchema } from "@/types/schemas";
import { AIAnalyzer } from "@/types/services";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import dotenv from "dotenv";
import { analyzeImagePromptGPT4o } from "../prompts/prompts";
import { imgAnalyzeSystemMsgStrict } from "../prompts/system";
dotenv.config();

export class GPT4Analyzer implements AIAnalyzer {
  name = "GPT-4.1";
  async analyze(imageBuffer: Buffer): Promise<FurnitureDetails> {
    try {
      const startTime = Date.now();
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Starting ${this.name} analysis...`);
      
      const result = await generateObject({
        model: openai("gpt-4.1-2025-04-14"),
        schema: furnitureDetailsSchema,
        output: "object",
        system: imgAnalyzeSystemMsgStrict,
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
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      const timestampEnd = new Date().toISOString();
      console.log(`[${timestampEnd}] ${this.name} completed in ${duration}ms`);
      console.log(`[${timestampEnd}] ${this.name} detected brand: "${result.object.merkki}"`);
      console.log(`[${timestampEnd}] ${this.name} detected model: "${result.object.malli}"`);
      
      return result.object;
    } catch (error) {
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] Error in ${this.name} analysis:`, error);
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
