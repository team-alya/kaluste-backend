import { z } from "zod";

const DimensionsSchema = z
  .object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
  })
  .describe("Dimensions in centimeters");

export const FurnitureAnalysis = z.object({
  type: z
    .string()
    .describe("The category of furniture (e.g., chair, table, sofa)"),
  brand: z.string().describe("The manufacturer or designer of the furniture"),
  model: z.string().describe("The specific model name or number"),
  color: z.string().describe("The primary color of the furniture"),
  dimensions: DimensionsSchema,
  age: z.number().describe("Estimated age in years"),
  condition: z
    .string()
    .describe(
      "Overall state of the furniture (e.g., Excellent, Good, Fair, Poor)"
    ),
});

// TODO:
// find out a way to return an error field if there is no furniture visible in image.
// right now OpenAI responds with furniture details even if there is a car in the image.
// can't use union schema since openai expects a json object as response format and not a list with two json objects.
