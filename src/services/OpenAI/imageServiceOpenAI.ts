import dedent from "dedent";
import { zodResponseFormat } from "openai/helpers/zod";
import { FurnitureAnalysis } from "../../schema";
import { resizeImage } from "../../utils/resizeImage";
import openai from "../../configs/openai";

const prompt = dedent` 
Analyze the furniture in the image and provide the following information:
1. Type: Identify the category of furniture (e.g., chair, table, sofa).
2. Brand: Specify the manufacturer or designer if identifiable/visible. If not fully certain, use "Unknown".
3. Model: Provide the specific model name or number if visible. If not identifiable/visible, use "Unspecified".
4. Color: Describe the primary color of the furniture.
5. Dimensions: Estimate the length, width, and height in centimeters.
6. Age: Estimate the age of the furniture in years. If uncertain, provide a range or best guess.
7. Condition: Assess the overall state (Excellent, Good, Fair, Poor).

Important notes:
- If you can't determine specific details or a specific detail is not explicitly visible in the image, use "Unknown" for text fields or 0 for numeric fields.
- Provide your best estimate for dimensions and age, even if not certain.
- If no furniture is visible in the image, return an object with an 'error' field explaining this.
- Ensure all text values start with a capital letter.
`;

// Function to analyze the provided image using OpenAI's GPT model, extracting furniture details
const analyzeImageOpenAI = async (imagePath: Buffer) => {
  try {
    // Get resized and optimized image
    const optimizedBase64Img = await resizeImage(imagePath);

    // Send request to OpenAI
    const response = await openai.client.chat.completions.create({
      model: openai.model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${optimizedBase64Img}`,
                detail: "auto",
              },
            },
          ],
        },
      ],
      response_format: zodResponseFormat(
        FurnitureAnalysis,
        "furniture_analysis"
      ),
    });

    // Extract response content into a variable
    const messageContent = response.choices[0].message.content;

    if (messageContent === null) {
      throw new Error("Message content is null");
    }

    // Parse the response to be in the format defined in zod schema
    const furnitureAnalysis = FurnitureAnalysis.parse(
      JSON.parse(messageContent)
    );

    return furnitureAnalysis;
  } catch (error) {
    // Handle any errors during the request
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
};

export default analyzeImageOpenAI;
