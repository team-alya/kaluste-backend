import express, { Request, Response } from "express";
import { finalAnalyze } from "../services/ai/generate-objects";
import { runImageAnalysisPipeline } from "../services/ai/image-analysis-pipeline";
import { imageUploadHandler } from "../utils/middleware";
import { resizeImage } from "../utils/resizeImage";

const router = express.Router();

router.post("/", imageUploadHandler(), async (req: Request, res: Response) => {
  try {
    const optimizedImage = await resizeImage(req.file!.buffer);
    let furnitureData = await runImageAnalysisPipeline(optimizedImage.buffer);

    // Jos merkki puuttuu tai on "Ei tiedossa", kutsutaan finalAnalyze
    if (!furnitureData.merkki || furnitureData.merkki === "Ei tiedossa") {
      console.log(
        "Merkki puuttuu, yritetään tunnistaa uudelleen GPT4-vision avulla...",
      );

      try {
        const finalResult = await finalAnalyze(optimizedImage.buffer);

        // Päivitetään vain merkki ja malli, säilytetään muut tiedot
        furnitureData = {
          ...furnitureData,
          merkki: finalResult.merkki,
          malli: finalResult.malli,
        };

        console.log("Lopullinen merkki tunnistus:", finalResult.merkki);
      } catch (analyzeError) {
        console.error("Virhe lopullisessa merkki-analyysissa:", analyzeError);
        // Jatketaan alkuperäisellä datalla jos finalAnalyze epäonnistuu
      }
    }

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
