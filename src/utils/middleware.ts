import multer from "multer";
import { ImageAnalysisResponse } from "../types";

export const imageUploadHandler = (fieldName: string) => {
  return multer({ storage: multer.memoryStorage() }).single(fieldName);
};

export const validateImageAnalysisResponse = (
  data: any
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
