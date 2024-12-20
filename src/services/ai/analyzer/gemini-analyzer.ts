// services/ai/analyzer/gemini-analyzer.ts

import { AIAnalyzer, AnalyzerResult } from "../../../types/analyzer";
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
// Palautetaan kovakoodattu vastaus tällä hetkellä
export class GeminiAnalyzer implements AIAnalyzer {
  name = "Gemini";

  async analyze(_imageBuffer: Buffer): Promise<AnalyzerResult> {
    await sleep(4000);
    return Promise.resolve({
      merkki: "",
      malli: "Akademia",
      väri: "Ei tiedossa",
      mitat: {
        pituus: 6,
        leveys: 0,
        korkeus: 0,
      },
      materiaalit: [],
      kunto: "Ei tiedossa",
    });
  }
}
