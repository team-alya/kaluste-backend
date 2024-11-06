import { ChatCompletionMessageParam } from "openai/resources";

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
  korkein_hinta: number;
  alin_hinta: number;
  myyntikanavat: string[];
}

export interface RepairAnalysisResponse {
  korjaus_ohjeet: string;
  kierrätys_ohjeet: string;
}

export interface UserConversation {
  furnitureDetails?: FurnitureDetails;
  price?: PriceAnalysisResponse;
  imageUrl?: string;
  messages: ChatCompletionMessageParam[];
}

export type ConversationHistory = Record<string, UserConversation>;

export interface UserQuery {
  requestId: string;
  question: string;
}

export interface LocationQuery {
  requestId: string;
  location: string;
  source: "donation" | "recycle" | "repair";
}

export interface LocationResponse {
  result: string;
}
