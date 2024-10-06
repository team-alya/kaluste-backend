import express, { Request, Response } from "express";
import { imageUploadHandler, imageValidator, validateFurnitureDetails } from "../utils/middleware";
import analyzePriceEstimate from "../services/priceService";


const router = express.Router();

router.post(
  "/",
  imageUploadHandler(),
  imageValidator,
  validateFurnitureDetails,
  async (req: Request, res: Response) => {
    try {
      const imageBase64 = req.file!.buffer.toString("base64");
      const furnitureDetails = JSON.parse(req.body.furnitureDetails);
      const analysisResult = await analyzePriceEstimate(imageBase64, furnitureDetails);
        res
        .status(200)
        .json({ message: "Price estimate was analyzed", result: analysisResult });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      }
    }
  }
);

export default router;