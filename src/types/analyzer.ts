export interface AnalyzerResult {
  merkki: string;
  malli: string;
  vari: string;
  mitat: {
    pituus: number;
    leveys: number;
    korkeus: number;
  };
  materiaalit: string[];
  kunto: string;
}

export interface AIAnalyzer {
  name: string;
  analyze: (imageBuffer: Buffer) => Promise<AnalyzerResult>;
}
