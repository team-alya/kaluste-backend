import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { ImageAnalysisResponse } from "../types";

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

export const validateImageAnalysisResponse = (
  data: unknown
): data is ImageAnalysisResponse => {
  return (
    typeof data === "object" &&
    typeof data.request_id === "string" &&
    typeof data.type === "string" &&
    typeof data.brand === "string" &&
    typeof data.model === "string" &&
    typeof data.color === "string" &&
    typeof data.dimensions === "object" &&
    typeof data.dimensions.length === "number" &&
    typeof data.dimensions.width === "number" &&
    typeof data.dimensions.height === "number" &&
    typeof data.age === "number" &&
    typeof data.condition === "string"
  );
};
