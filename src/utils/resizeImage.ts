import sharp from "sharp";

export const resizeImage = async (imagePath: Buffer) => {
  const sharpImage = sharp(imagePath);

  const metadata = await sharpImage.metadata();

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

  const optimizedBase64 = optimizedBuffer.toString("base64");

  return optimizedBase64;
};
