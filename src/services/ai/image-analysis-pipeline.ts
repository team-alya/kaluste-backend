import { ClaudeAnalyzer } from "./imageAnalyzer/claude-analyzer";
import { GeminiAnalyzer } from "./imageAnalyzer/gemini-analyzer";
import { GPT4Analyzer } from "./imageAnalyzer/gpt4-analyzer";
import { AIAnalysisPipeline } from "./imageAnalyzer/pipeline";

export const pipeline = new AIAnalysisPipeline([
  new GPT4Analyzer(),
  new ClaudeAnalyzer(),
  new GeminiAnalyzer(),
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
