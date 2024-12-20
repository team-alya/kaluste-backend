import { Request } from "express";
import { FurnitureDetails } from "./schemas";

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
