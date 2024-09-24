import multer from "multer";

export const imageUploadHandler = (fieldName: string) => {
  return multer({ storage: multer.memoryStorage() }).single(fieldName);
};
