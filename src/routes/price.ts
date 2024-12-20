import express, { Response } from "express";
import generateObjects from "../services/ai/generate-objects";
import { FurnitureDetailsRequest } from "../types/common-types";
import { PriceAnalysisResponse } from "../types/schemas";

const router = express.Router();

router.post("/", async (req: FurnitureDetailsRequest, res: Response) => {
  try {
    const { furnitureDetails } = req.body;

    const priceAnalysis: PriceAnalysisResponse =
      await generateObjects.analyzePrice(furnitureDetails);

    return res.json(priceAnalysis);
  } catch (error) {
    console.error("Error:");
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Price analysis failed",
    });
  }
});

export default router;
