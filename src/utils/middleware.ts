import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { NoReqIDResponse } from "../types";

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

// export const validateImageAnalysisResponse = (
//   data: unknown
// ): data is ImageAnalysisResponse => {
//   return (
//     typeof data === "object" &&
//     typeof data.request_id === "string" &&
//     typeof data.type === "string" &&
//     typeof data.brand === "string" &&
//     typeof data.model === "string" &&
//     typeof data.color === "string" &&
//     typeof data.dimensions === "object" &&
//     typeof data.dimensions.length === "number" &&
//     typeof data.dimensions.width === "number" &&
//     typeof data.dimensions.height === "number" &&
//     typeof data.age === "number" &&
//     typeof data.condition === "string"
//   );
// };

export const validateFurnitureDetails = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try{
  const furnitureDetails: NoReqIDResponse = JSON.parse(req.body.furnitureDetails);
  const requiredFields = ['type', 'brand', 'model', 'color', 'age', 'condition'];
  const missingFields = requiredFields.filter(field => !(furnitureDetails as any)[field]);

  if (!furnitureDetails.dimensions) {
    missingFields.push('dimensions (length, width, height)');
  } else {
    const dimensionFields = ['length', 'width', 'height'];
    const missingDimensions = dimensionFields.filter(dim => {
      const value = (furnitureDetails.dimensions as any)[dim];
      return value === undefined || typeof value !== 'number' || value <= 0;
    });

    if (missingDimensions.length > 0) {
      missingFields.push(`dimensions (${missingDimensions.join(', ')})`);
    }
  }

  if (missingFields.length > 0) {
    return res.status(400).json({ error: `The following fields are missing or incomplete: ${missingFields.join(', ')}` });
  }
} catch (error: unknown) {
  if (error instanceof Error) {
    return res.status(400).json({ error: error.message });
  }
}
  return next();
};