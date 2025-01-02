import express, { Request, Response } from "express";
import { finalAnalyze } from "../services/ai/generate-objects";
import { runImageAnalysisPipeline } from "../services/ai/image-analysis-pipeline";
import { imageUploadHandler } from "../utils/middleware";
import { resizeImage } from "../utils/resizeImage";

const router = express.Router();

router.post("/", imageUploadHandler(), async (req: Request, res: Response) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ error: "No image file provided" });
    }
    // const mockResponseData = {
    //   ...getMockFurnitureData(),
    //   requestId: crypto.randomUUID(),
    // };
    // return res.status(200).json(mockResponseData);

    const optimizedImage = await resizeImage(req.file.buffer);

    try {
      let furnitureData = await runImageAnalysisPipeline(optimizedImage.buffer);

      if (!furnitureData.merkki || furnitureData.merkki === "Ei tiedossa") {
        console.log("Brand missing, attempting final analysis...");
        try {
          const finalResult = await finalAnalyze(optimizedImage.buffer);
          // Päivitetään vain merkki ja malli. Muuten käytetään furniterDataa analyysia sellaisenaan.
          furnitureData = {
            ...furnitureData,
            merkki: finalResult.merkki,
            malli: finalResult.malli,
          };
        } catch (analyzeError) {
          console.error("Final analysis error:", analyzeError);
        }
      }

      const responseData = {
        ...furnitureData,
        requestId: crypto.randomUUID(),
      };
      console.log("returning response data");

      return res.status(200).json(responseData);
    } catch (error) {
      console.error("Pipeline error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Analysis pipeline failed";
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Server error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return res.status(500).json({ error: errorMessage });
  }
});

export default router;
