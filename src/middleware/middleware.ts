import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { z, ZodError } from "zod";
import {
  FurnitureDetailsRequest,
  LocationQuery,
  ReviewQuery,
  UserQuery,
} from "../types/middleware";
import { furnitureDetailsSchema } from "../types/schemas";

/**
 * Middleware to extract image from the request.
 * NOTE: Most/All of these middlewares are not used in the project. They are referring to the old implementation GitHub TAG v1.0.
 * imageUploadHandler is only in use atm
 */

export const imageUploadHandler = () => {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB
      fieldSize: 50 * 1024 * 1024, // 50MB
    },
  }).single("image");
};

/*
All above this is old and not used in the project.
TODO: Remove all the above code if not needed.
*/

export const locationQuerySchema = z.object({
  requestId: z.string(),
  location: z.string(),
  source: z.union([
    z.literal("donation"),
    z.literal("recycle"),
    z.literal("repair"),
  ]),
});

export const reviewSchema = z.object({
  requestId: z.string(),
  review: z.object({
    rating: z
      .number()
      .min(1, { message: "Rating must be between 1 and 5" })
      .max(5, { message: "Rating must be between 1 and 5" }),
    comment: z.string().optional(),
  }),
});

/**
 * Middleware to validate that a file of image format was sent.
 */
export const imageValidator = (
  req: Request,
  res: Response,
  next: NextFunction,
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

/**
 * Middleware that parses request body and expects to find furnitureDetails.
 */
export const furnitureDetailsParser = (
  req: FurnitureDetailsRequest,
  res: Response,
  next: NextFunction,
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

/**
 * Middleware that parses request body and expects to find a chat question request.
 */
export const userQueryParser = (
  req: UserQuery,
  res: Response,
  next: NextFunction,
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

/**
 * Middleware that parses request body and expects to find a user location request.
 */
export const locationQueryParser = (
  req: LocationQuery,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.body) {
      res
        .status(400)
        .json({ error: "Request ID, location, and source are required" });
      return;
    }
    locationQuerySchema.parse(req.body);
  } catch (err: unknown) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown validation error";
    return res.status(400).json({ errorMessage });
  }
  return next();
};

/**
 * Middleware that parses request body and expects to find a user review request.
 */
export const reviewQueryParser = (
  req: ReviewQuery,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.body) {
      res.status(400).json({ error: "Request ID and review are required" });
      return;
    }
    reviewSchema.parse(req.body);
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return res.status(400).json({
        error: err.errors.map((e) => ({
          message: e.message,
          path: e.path,
        })),
      });
    }

    const errorMessage =
      err instanceof Error ? err.message : "Unknown validation error";
    return res.status(400).json({ errorMessage });
  }
  return next();
};
