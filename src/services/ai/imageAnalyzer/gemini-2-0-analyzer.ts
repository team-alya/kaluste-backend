import { FurnitureDetails, furnitureDetailsSchema } from "@/types/schemas";
import { AIAnalyzer } from "@/types/services";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import dotenv from "dotenv";
import { analyzeImagePrompt } from "../prompts/prompts";
import { imgAnalyzeSystemMsg } from "../prompts/system";
dotenv.config();
export class GeminiAnalyzer implements AIAnalyzer {
  name = "Gemini-2-5";
  async analyze(imageBuffer: Buffer): Promise<FurnitureDetails> {
    try {
      const result = await generateObject({
        model: google("gemini-2.5-pro-exp-03-25", {
          useSearchGrounding: true,
        }),
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
