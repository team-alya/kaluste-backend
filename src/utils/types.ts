export interface FurnitureDetails {
  request_id: string;
  type: string;
  brand: string;
  model: string;
  color: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  age: number;
  condition: string;
}

// might not need this, if frontend uses request_id to maintain conversation with user
export type NoReqIDResponse = Omit<FurnitureDetails, "request_id">;

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
