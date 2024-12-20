import { Request } from "express";
import { FurnitureDetails } from "./schemas";

export interface FurnitureDetailsRequest extends Request {
  body: {
    furnitureDetails: FurnitureDetails;
  };
}
