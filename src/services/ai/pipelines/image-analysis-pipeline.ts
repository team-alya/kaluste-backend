import { AIAnalysisPipeline } from "../imageAnalyzer";
import { ClaudeAnalyzer } from "../imageAnalyzer/claude-analyzer";
import { GeminiAnalyzer } from "../imageAnalyzer/gemini-2-0-analyzer";
import { GPT4Analyzer } from "../imageAnalyzer/gpt4-analyzer";

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
