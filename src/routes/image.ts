/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from "express";
import { imageUploadHandler, imageValidator } from "../utils/middleware";
import analyzeBase64Image from "../services/imageService";

const router = express.Router();

router.post(
  "/",
  imageUploadHandler(),
  imageValidator,
  async (req: Request, res: Response) => {
    try {
      const imageBase64 = req.file!.buffer.toString("base64");
      const analysisResult = await analyzeBase64Image(imageBase64);
      res
        .status(200)
        .json({ message: "Image was analyzed", result: analysisResult });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

export default router;
