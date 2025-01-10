import { ImageAnalysisPipeline } from "../imageAnalyzer";
import { ClaudeAnalyzer } from "../imageAnalyzer/claude-analyzer";
import { GeminiAnalyzer } from "../imageAnalyzer/gemini-2-0-analyzer";
import { GPT4Analyzer } from "../imageAnalyzer/gpt4-analyzer";

export const pipeline = new ImageAnalysisPipeline([
  new GPT4Analyzer(), // GPT-4o
  new ClaudeAnalyzer(), // Sonnet 3.5
  new GeminiAnalyzer(), // Gemini 2.0
  // new Gemini_1_5_Analyzer(), // I dont think Gemini 1.5 is needed here 2.0 is better and more accurate. Maybe some different variations of the same model could be used? Modify prompt and schema descriptions?
]);

export const runImageAnalysisPipeline = async (imageBuffer: Buffer) => {
  try {
    const { result, usedAnalyzers } = await pipeline.analyze(imageBuffer);
    console.log("Used analyzers:", usedAnalyzers);
    return result;
  } catch (error) {
    console.error("Error in analysis pipeline:", error);
    throw error;
  }
};
