import sharp from "sharp";

export const resizeImage = async (imagePath: Buffer) => {
  // Transform image into sharp instance
  const sharpImage = sharp(imagePath);

  // Extract image metadata to get width and height of image
  const metadata = await sharpImage.metadata();

  // Define image maximum width and height
  const maxWidth = 1920;
  const maxHeight = 1080;

  // Resize the received image
  if (metadata.width && metadata.height) {
    if (metadata.width > maxWidth || metadata.height > maxHeight) {
      sharpImage.resize({
        width: maxWidth,
        height: maxHeight,
        fit: "inside",
        withoutEnlargement: true,
      });
    }
  }

  // Transform image into JPEG form and optimize its quality
  const optimizedBuffer = await sharpImage
    .jpeg({ quality: 80, progressive: true })
    .toBuffer();

  // Transform optimized image into BASE64 format
  const optimizedBase64 = optimizedBuffer.toString("base64");

  return optimizedBase64;
};
