/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from "express";
import {
  imageUploadHandler,
  imageValidator,
  furnitureDetailsParser,
} from "../utils/middleware";
import analyzeRepairEstimate from "../services/repairService";
import { FurnitureDetails } from "../utils/types";

const router = express.Router();

router.post(
  "/",
  imageUploadHandler(),
  imageValidator,
  furnitureDetailsParser,
  async (
    req: Request<unknown, unknown, { furniture: FurnitureDetails }>,
    res: Response
  ) => {
    try {
      const imageBase64 = req.file!.buffer.toString("base64");
      const furniture = req.body.furniture;
      const analysisResult = await analyzeRepairEstimate(
        imageBase64,
        furniture
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
