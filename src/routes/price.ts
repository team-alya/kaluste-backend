/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from "express";
import { validateFurnitureDetails } from "../utils/middleware";
import analyzePrice from "../services/OpenAI/priceServiceOpenAI";
import { FurnitureDetails } from "../utils/types";

interface FurnitureDetailsRequest extends Request {
  body: {
    furnitureDetails: FurnitureDetails;
  };
}

const router = express.Router();

router.post(
  "/",
  validateFurnitureDetails,
  async (req: FurnitureDetailsRequest, res: Response) => {
    try {
      const furnitureDetails = req.body.furnitureDetails;
      const analysisResult = await analyzePrice(furnitureDetails);
      res.status(200).json({
        message: "Price estimate was analyzed",
        result: analysisResult,
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

export default router;
