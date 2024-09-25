import express, { Request, Response } from "express";
import { imageUploadHandler } from "../utils/middleware";
import { analyzeBase64Image } from "../services/imageService";
import analyzeImage from "../services/imageService";
import fs from "fs";
import path from "path";


const router = express.Router();

router.post("/", imageUploadHandler("image"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image was uploaded" });
  }
  console.log(req.file);
  return res.send("Image was uploaded");
});

router.post("/analyze", imageUploadHandler("image"), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image was uploaded" });
  }

  try {
    const imageBase64 = req.file.buffer.toString('base64');

    const analysisResult = await analyzeBase64Image(imageBase64);

    return res.status(200).json({ message: "Image was analyzed", result: analysisResult });
  } catch (error) {
    console.error("Error during image analysis:", error);
    return res.status(500).json({ error: "Failed to analyze image" });
  }
});

router.post("/analyze1", imageUploadHandler("image"), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image was uploaded" });
  }

  try {
    // Tallenna kuva väliaikaisesti
    const filePath = path.join(__dirname,'..', `image.jpg`);
    fs.writeFileSync(filePath, req.file.buffer);

    const analysisResult = await analyzeImage(filePath);

    // Poista väliaikainen tiedosto
    fs.unlinkSync(filePath);

    return res.status(200).json({ message: "Image was analyzed", result: analysisResult });
  } catch (error) {
    console.error("Error during image analysis:", error);
    return res.status(500).json({ error: "Failed to analyze image" });
  }
});

export default router;
