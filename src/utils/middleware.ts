import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { FurnitureDetails } from "./types";
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

export const validateFurnitureDetails = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const furnitureDetails: FurnitureDetails = JSON.parse(
      req.body.furnitureDetails
    );
    const requiredFields = [
      "type",
      "brand",
      "model",
      "color",
      "age",
      "condition",
    ];
    const missingFields = requiredFields.filter(
      (field) => !(furnitureDetails as any)[field]
    );

    if (!furnitureDetails.mitat) {
      missingFields.push("mitat (pituus, leveys, korkeus)");
    } else {
      const dimensionFields = ["length", "width", "height"];
      const missingDimensions = dimensionFields.filter((dim) => {
        const value = (furnitureDetails.mitat as any)[dim];
        return value === undefined || typeof value !== "number" || value <= 0;
      });

      if (missingDimensions.length > 0) {
        missingFields.push(`mitat (${missingDimensions.join(", ")})`);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `The following fields are missing or incomplete: ${missingFields.join(
          ", "
        )}`,
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
  }
  return next();
};

export const furnitureDetailsParser = (
  req: Request<
    unknown,
    unknown,
    { furnitureDetails: string; furniture: FurnitureDetails }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.body.furnitureDetails) {
      return res
        .status(400)
        .json({ error: "Furniture details were not included in the request" });
    }
    const furnitureDetails: unknown = JSON.parse(req.body.furnitureDetails);
    const parsedFurniture: FurnitureDetails =
      furnitureDetailsSchema.parse(furnitureDetails);
    req.body.furniture = parsedFurniture;
  } catch (error: unknown) {
    return res.status(400).json({ error });
  }
  return next();
};
