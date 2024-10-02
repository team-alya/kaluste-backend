import express, { Request, Response } from "express";
import { imageUploadHandler } from "../utils/middleware";
import analyzeImageOpenAI from "../services/OpenAI/imageServiceOpenAI";
import analyzeImageGemini from "../services/Gemini/imageServiceGemini";

const router = express.Router();

router.post(
  "/",
  imageUploadHandler("image"),
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image was uploaded" });
    }
    try {
      // const imageBase64 = req.file.buffer.toString("base64");

      const openaiPromise = await analyzeImageOpenAI(req.file.buffer);
      const geminiPromise = await analyzeImageGemini(req.file.buffer);

      const [openaiResult, geminiResult] = await Promise.all([
        openaiPromise,
        geminiPromise,
      ]);

      const analysisResult = {
        openai: openaiResult,
        gemini: geminiResult,
      };

      return res
        .status(200)
        .json({ message: "Image was analyzed", result: analysisResult });
    } catch (error) {
      return res.status(500).json({ error: "Failed to analyze image" });
    }
  }
);

export default router;
