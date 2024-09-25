import express, { Request, Response } from "express";
import { imageUploadHandler, imageValidator } from "../utils/middleware";

const router = express.Router();

router.post(
  "/",
  imageUploadHandler(),
  imageValidator,
  (req: Request, res: Response) => {
    console.log(req.file);
    return res.send("Image was uploaded");
    // Send req.file / req.file.buffer to imageService for base64 encoding and Gemini analysis
  }
);

export default router;
