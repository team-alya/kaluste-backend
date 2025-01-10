import { FurnitureDetails } from "./schemas";

export interface AIAnalyzer {
  name: string;
  analyze: (imageBuffer: Buffer) => Promise<FurnitureDetails>;
}
