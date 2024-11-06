/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from "express";
import { furnitureDetailsParser } from "../utils/middleware";
import analyzePrice from "../services/OpenAI/priceServiceOpenAI";

const router = express.Router();

router.post(
  "/",
  furnitureDetailsParser,
  async (req: Request, res: Response) => {
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
