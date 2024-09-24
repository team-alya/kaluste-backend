import express, { Request, Response } from "express";
import { imageUploadHandler } from "../utils/middleware";

const router = express.Router();

router.post("/", imageUploadHandler("image"), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image was uploaded" });
  }
  console.log(req.file);
  return res.send("Image was uploaded");
});

export default router;
