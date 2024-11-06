/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from "express";
import { imageUploadHandler, imageValidator } from "../utils/middleware";
import imageServiceOpenAI from "../services/OpenAI/imageServiceOpenAI";

const router = express.Router();

router.post(
  "/",
  imageUploadHandler(),
  imageValidator,
  async (req: Request, res: Response) => {
    try {
      const analysisResult = await imageServiceOpenAI.analyzeImageOpenAI(
        req.file!.buffer
      );

      return res
        .status(200)
        .json({ message: "Image was analyzed", result: analysisResult });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: "An unexpected error occurred." });
    }
  }
);

export default router;
