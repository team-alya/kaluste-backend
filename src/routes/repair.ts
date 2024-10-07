/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from "express";
import { imageUploadHandler, imageValidator } from "../utils/middleware";
import analyzeRepairEstimate from "../services/repairService";

const router = express.Router();

router.post(
  "/",
  imageUploadHandler(),
  imageValidator,
  async (req: Request, res: Response) => {
    try {
      const imageBase64 = req.file!.buffer.toString("base64");
      const furnitureDetails = req.body.furnitureDetails;
      const analysisResult = await analyzeRepairEstimate(
        imageBase64,
        furnitureDetails
      );
      res
        .status(200)
        .json({ message: "Repair need was analyzed", result: analysisResult });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

export default router;
