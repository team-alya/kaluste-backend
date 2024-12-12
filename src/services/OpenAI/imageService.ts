import { zodResponseFormat } from "openai/helpers/zod";
import { resizeImage } from "../../utils/resizeImage";
import { furnitureDetailsSchema } from "../../utils/schemas";
import openai from "../../configs/openai";
import { ConversationHistory, FurnitureDetails } from "../../utils/types";
import { v4 as uuidv4 } from "uuid";
import { CONVERSATION_TIMEOUT_MS } from "../../utils/constants";
import { cleanupConversationHistory } from "../../utils/clearContext";
import { createImagePrompt } from "../../prompts/prompts";

const conversationHistory: ConversationHistory = {};

// Function to analyze the provided image using OpenAI's GPT model, extracting furniture details
const analyzeImage = async (
  imagePath: Buffer
): Promise<FurnitureDetails | { error: string }> => {
  try {
    const requestId = uuidv4();

    const prompt = createImagePrompt(requestId);

    const optimizedBase64Img = await resizeImage(imagePath);

    conversationHistory[requestId] = {
      timestamp: Date.now(),
      imageUrl: `data:image/jpeg;base64,${optimizedBase64Img}`,
      messages: [
        { role: "user", content: prompt },
        {
          role: "user",
          content: [
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
    };

    // Start cleanup function which removes conversations older than 24hrs
    cleanupConversationHistory(conversationHistory);

    const response = await openai.client.chat.completions.create({
      model: openai.model,
      messages: conversationHistory[requestId].messages,
      response_format: zodResponseFormat(
        furnitureDetailsSchema,
        "furniture_analysis"
      ),
    });

    const messageContent = response.choices[0].message.content;

    if (messageContent === null) {
      throw new Error("Message content is null");
    }

    const jsonfiedMessage: unknown = JSON.parse(messageContent);
    if (
      jsonfiedMessage &&
      typeof jsonfiedMessage === "object" &&
      "error" in jsonfiedMessage
    ) {
      throw new Error(jsonfiedMessage.error as string);
    }

    const furnitureAnalysis = furnitureDetailsSchema.parse(jsonfiedMessage);

    return furnitureAnalysis;
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

export default { analyzeImage, conversationHistory };
