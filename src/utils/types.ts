import { Request } from "express";
import { ChatCompletionMessageParam } from "openai/resources";
import { FurnitureDetails } from "./schemas";

export interface PriceAnalysisResponse {
  requestId: string;
  korkein_hinta: number;
  alin_hinta: number;
  myyntikanavat: string[];
  tori_hinnat: ToriPrices;
}

export interface ToriPrices {
  [key: string]: [number, number];
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
  timestamp: number;
}

/**
 * A map of objects with key: requestId and value: UserConversation.
 *
 * - All user conversations are saved to this map and removed by a timed context remover.
 */
export type ConversationHistory = Record<string, UserConversation>;

export interface ChatResponse {
  requestId: string;
  answer: string;
}

export interface UserQuery extends Request {
  body: {
    requestId: string;
    question: string;
  };
}

export interface FurnitureDetailsRequest extends Request {
  body: {
    furnitureDetails: FurnitureDetails;
  };
}

export interface ReviewQuery extends Request {
  body: {
    requestId: string;
    review: {
      rating: 1 | 2 | 3 | 4 | 5;
      comment?: string;
    };
  };
}

export interface LocationQuery extends Request {
  body: {
    requestId: string;
    location: string;
    source: "donation" | "recycle" | "repair";
  };
}

export interface LocationResponse {
  result: string;
}

export interface loggerResponse {
  message: string;
}
