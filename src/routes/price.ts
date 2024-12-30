import express, { Response } from "express";
import { PriceAnalysisPipeline } from "../services/ai/price-analysis-pipeline";
import { FurnitureDetailsRequest } from "../types/common-types";

const router = express.Router();

router.post("/", async (req: FurnitureDetailsRequest, res: Response) => {
  try {
    const { furnitureDetails } = req.body;
    const pipeline = new PriceAnalysisPipeline();
    const { combinedEstimate } = await pipeline.analyzePrices(furnitureDetails);

    // Palautetaan vain combinedEstimate, joka vastaa frontin odottamaa muotoa
    return res.json(combinedEstimate);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Price analysis failed",
    });
  }
});

export default router;
