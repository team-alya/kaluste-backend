// utils/imageProcessor.ts
import sharp from "sharp";

/**
 * Resize and optimize image for LLM API requirements.
 * Optimizes for both Claude and OpenAI compatibility:
 * - Max dimension: 1568px (Claude's limit)
 * - Target shortest side: 768px (OpenAI's recommendation)
 * - Format: JPEG
 */

export const resizeImage = async (imageBuffer: Buffer) => {
  const sharpImage = sharp(imageBuffer);
  const metadata = await sharpImage.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error("Could not read image dimensions");
  }

  const MAX_DIMENSION = 1568;
  const TARGET_SHORT_SIDE = 768;

  let width = metadata.width;
  let height = metadata.height;
  const aspectRatio = width / height;

  // First ensure no dimension exceeds max
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    if (width > height) {
      width = MAX_DIMENSION;
      height = Math.round(width / aspectRatio);
    } else {
      height = MAX_DIMENSION;
      width = Math.round(height * aspectRatio);
    }
  }

  // Then ensure shortest side is at least 768px for optimal OpenAI processing
  const shortestSide = Math.min(width, height);
  if (shortestSide > TARGET_SHORT_SIDE) {
    const scale = TARGET_SHORT_SIDE / shortestSide;
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const optimizedBuffer = await sharpImage
    .resize({
      width,
      height,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({
      quality: 100,
      progressive: true,
    })
    .toBuffer();

  return {
    buffer: optimizedBuffer,
    base64: optimizedBuffer.toString("base64"),
    metadata: {
      width,
      height,
      format: "jpeg",
      megapixels: (width * height) / 1000000,
    },
  };
};
