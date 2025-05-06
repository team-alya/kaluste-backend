import { FurnitureDetails, furnitureDetailsSchema } from "@/types/schemas";
import { AIAnalyzer } from "@/types/services";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import dotenv from "dotenv";
import { analyzeImagePromptGPTO3 } from "../prompts/prompts";
dotenv.config();

export class O3Analyzer implements AIAnalyzer {
  name = "O3-Reasoning";
  async analyze(imageBuffer: Buffer): Promise<FurnitureDetails> {
    try {
      const startTime = Date.now();
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] Starting ${this.name} analysis...`);

      const result = await generateObject({
        model: openai.responses("o3"),
        schema: furnitureDetailsSchema,
        output: "object",
        // system: imgAnalyzeSystemMsgStrict,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: analyzeImagePromptGPTO3,
              },
              {
                type: "image",
                image: imageBuffer,
              },
            ],
          },
        ],
        providerOptions: {
          openai: {
            reasoningEffort: "medium", // 'low', 'medium', 'high'
            reasoningSummary: "auto", // 'auto' tai 'detailed'
          },
        },
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
}
