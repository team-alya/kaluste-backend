import { Request } from "express";
import { FurnitureDetails } from "./schemas";

export interface ModelSelectionOptions {
  model?: string; // "gpt4-1" | "o3" | "claude" | "gemini-2-5" | "all"
  reasoningEffort?: "low" | "medium" | "high"; // Only used for O3 model
}

export interface FurnitureDetailsRequest extends Request {
  body: {
    furnitureDetails: FurnitureDetails;
  };
}

export interface ImageAnalysisRequest extends Request {
  modelSelection?: ModelSelectionOptions;
}
