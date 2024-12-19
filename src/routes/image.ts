import express, { Request, Response } from "express";
import imageService from "../services/ai/generate-objects";
import { imageUploadHandler } from "../utils/middleware";

const router = express.Router();

router.post("/", imageUploadHandler(), async (req: Request, res: Response) => {
  try {
    const furnitureData = await imageService.analyzeImage(req.file!.buffer);

    const responseData = {
      ...furnitureData,
      requestId: crypto.randomUUID(),
    };

    return res.status(200).json(responseData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
});

export default router;
