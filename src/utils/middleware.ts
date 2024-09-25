import { NextFunction, Request, Response } from "express";
import multer from "multer";

export const imageUploadHandler = () => {
  return multer({ storage: multer.memoryStorage() }).single("image");
};

export const imageValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file was uploaded" });
    }
    if (!req.file.mimetype.includes("image")) {
      return res.status(400).json({ error: "Uploaded file is not an image" });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.json({ error: error.message });
    }
  }
  return next();
};
