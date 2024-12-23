import express, { Request, Response } from "express";
import { runImageAnalysisPipeline } from "../services/ai/image-analysis-pipeline";
import { imageUploadHandler } from "../utils/middleware";
import { resizeImage } from "../utils/resizeImage";

const router = express.Router();

router.post("/", imageUploadHandler(), async (req: Request, res: Response) => {
  try {
    const optimizedImage = await resizeImage(req.file!.buffer);
    const furnitureData = await runImageAnalysisPipeline(optimizedImage.buffer);

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
