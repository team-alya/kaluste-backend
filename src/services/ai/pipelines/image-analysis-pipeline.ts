import { ModelSelectionOptions } from "../../../types/api";
import { ImageAnalysisPipeline } from "../imageAnalyzer";
import { ClaudeAnalyzer } from "../imageAnalyzer/claude-analyzer";
import { GeminiAnalyzer } from "../imageAnalyzer/gemini-2-5-analyzer";
import { GPT4Analyzer } from "../imageAnalyzer/gpt4-analyzer";
import { O3Analyzer } from "../imageAnalyzer/o3-analyzer";

// Default pipeline with all analyzers
export const createPipeline = (options?: ModelSelectionOptions) => {
  // If no specific model is selected or "all" is selected, use all analyzers
  if (!options?.model || options.model === "all") {
    return new ImageAnalysisPipeline([
      new GPT4Analyzer(),
      new O3Analyzer(options?.reasoningEffort || "medium"),
      new ClaudeAnalyzer(),
      new GeminiAnalyzer(),
    ]);
  }
  console.log("Creating pipeline with selected model:", options.model);

  // Otherwise, create a pipeline with just the selected model
  switch (options.model) {
    case "gpt4-1":
      return new ImageAnalysisPipeline([new GPT4Analyzer()]);
    case "o3":
      return new ImageAnalysisPipeline([
        new O3Analyzer(options.reasoningEffort || "medium"),
      ]);
    case "claude":
      return new ImageAnalysisPipeline([new ClaudeAnalyzer()]);
    case "gemini-2-5":
      return new ImageAnalysisPipeline([new GeminiAnalyzer()]);
    default:
      // Fallback to all models if an invalid model is specified
      return new ImageAnalysisPipeline([
        new GPT4Analyzer(),
        new O3Analyzer(options?.reasoningEffort || "medium"),
        new ClaudeAnalyzer(),
        new GeminiAnalyzer(),
      ]);
  }
};

export const runImageAnalysisPipeline = async (
  imageBuffer: Buffer,
  options?: ModelSelectionOptions,
) => {
  try {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Starting image analysis pipeline...`);
    if (options?.model) {
      console.log(`[${timestamp}] Using model: ${options.model}`);
    }
    if (options?.model === "o3" && options?.reasoningEffort) {
      console.log(
        `[${timestamp}] O3 reasoning effort: ${options.reasoningEffort}`,
      );
    }

    const pipeline = createPipeline(options);
    const { result, usedAnalyzers } = await pipeline.analyze(imageBuffer);

    console.log(`[${timestamp}] Analysis complete`);
    console.log(`[${timestamp}] Used analyzers: ${usedAnalyzers.join(", ")}`);
    console.log(`[${timestamp}] Furniture brand: "${result.merkki}"`);
    console.log(`[${timestamp}] Furniture model: "${result.malli}"`);

    return result;
  } catch (error) {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] Error in analysis pipeline:`, error);
    throw error;
  }
};
