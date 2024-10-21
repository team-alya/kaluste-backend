export interface FurnitureDetails {
  merkki: string;
  malli: string;
  väri: string;
  mitat: {
    pituus: number;
    leveys: number;
    korkeus: number;
  };
  materiaalit: string[];
  kunto: string;
}

export interface PriceAnalysisResponse {
  highest_price: number;
  lowest_price: number;
  average_price: number;
  description: string;
  sell_probability: number;
}

export interface RepairAnalysisResponse {
  repair_instructions: string;
  recycle_instructions: string;
  suggestion: string;
}
