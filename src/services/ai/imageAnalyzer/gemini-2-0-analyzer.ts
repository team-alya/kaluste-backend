import { FurnitureDetails, furnitureDetailsSchema } from "@/types/schemas";
import { AIAnalyzer } from "@/types/services";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import dotenv from "dotenv";
import { analyzeImagePrompt } from "../prompts/prompts";
import { imgAnalyzeSystemMsgStrict } from "../prompts/system";
dotenv.config();
export class GeminiAnalyzer implements AIAnalyzer {
  name = "Gemini-2.5";
  async analyze(imageBuffer: Buffer): Promise<FurnitureDetails> {
    try {
      const startTime = Date.now();
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Starting ${this.name} analysis...`);
      
      const result = await generateObject({
        model: google("gemini-2.5-pro-preview-03-25", {
          useSearchGrounding: true,
        }),
        schema: furnitureDetailsSchema,
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
