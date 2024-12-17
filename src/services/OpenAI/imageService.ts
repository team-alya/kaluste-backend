import { zodResponseFormat } from "openai/helpers/zod";
import { resizeImage } from "../../utils/resizeImage";
import { furnitureDetailsSchema } from "../../utils/schemas";
import openai from "../../configs/openai";
import { FurnitureDetails } from "../../utils/types";
import { v4 as uuidv4 } from "uuid";
import { CONVERSATION_TIMEOUT_MS } from "../../utils/constants";
import { cleanupConversationHistory } from "../../utils/clearContext";
import { createImagePrompt } from "../../prompts/prompts";
import conversationHistory from "../../context/conversations";

/**
 * Analyze a given image to extract the furniture's details
 */
const analyzeImage = async (
  imagePath: Buffer
): Promise<FurnitureDetails | { error: string }> => {
  try {
    const requestId = uuidv4();
    const optimizedBase64Img = await resizeImage(imagePath);

    // Pyydetään ensin analyysi kuvasta
    const imageAnalysisResponse = await openai.client.chat.completions.create({
      model: openai.model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: createImagePrompt(),
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
        furnitureDetailsSchema,
        "furniture_analysis"
      ),
    });

    const analysisContent = imageAnalysisResponse.choices[0].message.content;
    if (!analysisContent) {
      throw new Error("Analysis content is null");
    }

    conversationHistory[requestId] = {
      timestamp: Date.now(),
      messages: [
        {
          role: "user",
          content: "Käyttäjä lähetti kuvan analysoitavaksi",
        },
        {
          role: "assistant",
          content: analysisContent,
        },
      ],
    };

    // Start cleanup function which removes conversations older than 24hrs
    cleanupConversationHistory(conversationHistory);

    const parsedContent: unknown = JSON.parse(analysisContent);
    if (
      typeof parsedContent === "object" &&
      parsedContent &&
      "error" in parsedContent
    ) {
      throw new Error(parsedContent.error as string);
    }

    const furnitureAnalysis = furnitureDetailsSchema.parse(parsedContent);

    return {
      requestId,
      ...furnitureAnalysis,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
};

setInterval(
  () => cleanupConversationHistory(conversationHistory),
  CONVERSATION_TIMEOUT_MS
);

export default { analyzeImage };
