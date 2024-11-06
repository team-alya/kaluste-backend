import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { FurnitureDetailsRequest, UserQuery } from "./types";
import { furnitureDetailsSchema } from "./schemas";

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
      return res
        .status(400)
        .json({ error: "Image was not included in the request" });
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

export const furnitureDetailsParser = (
  req: FurnitureDetailsRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.furnitureDetails) {
      return res
        .status(400)
        .json({ error: "Furniture details were not included in the request" });
    }
    const furnitureDetails: unknown = req.body.furnitureDetails;
    furnitureDetailsSchema.parse(furnitureDetails);
  } catch (error: unknown) {
    return res.status(400).json({ error });
  }
  return next();
};

export const userQueryValidator = (
  req: UserQuery,
  res: Response,
  next: NextFunction
) => {
  try {
    const { requestId, question } = req.body;
    if (!requestId || !question) {
      return res
        .status(400)
        .json({ error: "Request ID and question are required" });
    }

    if (typeof requestId !== "string" || typeof question !== "string") {
      return res
        .status(400)
        .json({ error: "Request ID and question must be strings" });
    }
    return next();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown validation error";
    return res.status(400).json({ errorMessage });
  }
};
