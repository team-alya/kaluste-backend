import { ClaudeAnalyzer } from "./analyzer/claude-analyzer";
import { GeminiAnalyzer } from "./analyzer/gemini-analyzer";
import { GPT4Analyzer } from "./analyzer/gpt4-analyzer";
import { AIAnalysisPipeline } from "./analyzer/pipeline";

export const pipeline = new AIAnalysisPipeline([
  new GPT4Analyzer(),
  new GeminiAnalyzer(),
  new ClaudeAnalyzer(),
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
