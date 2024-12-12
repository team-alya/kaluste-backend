import { FurnitureDetails, LocationQuery } from "../../utils/types";
import openai from "../../configs/openai";
import { ChatCompletionMessageParam } from "openai/resources";
import {
  createDonationPrompt,
  createRecyclePrompt,
  createRepairPrompt,
} from "../../prompts/prompts";
import conversationHistory from "../../context/conversations";

const createPrompt = (
  data: LocationQuery["body"],
  furnitureDetails: FurnitureDetails
) => {
  let prompt: string | null;
  const location = data.location;

  switch (data.source) {
    case "donation":
      prompt = createDonationPrompt(furnitureDetails, location);
      break;
    case "recycle":
      prompt = createRecyclePrompt(furnitureDetails, location);
      break;
    case "repair":
      prompt = createRepairPrompt(furnitureDetails, location);
      break;
  }

  return prompt;
};

/**
 * Analyze given user location and return places that match.
 */
const analyzeLocation = async (data: LocationQuery["body"]) => {
  const context = conversationHistory[data.requestId];
  const prompt = createPrompt(data, context.furnitureDetails!);
  if (!prompt) {
    throw new Error("During during location prompt creation");
  }
  const message: ChatCompletionMessageParam = {
    role: "user",
    content: prompt,
  };
  const response = await openai.client.chat.completions.create({
    model: openai.model,
    messages: [message],
  });

  const responseContent = response.choices[0].message.content;
  if (responseContent === null) {
    throw new Error("Error analyzing location");
  }

  context.messages.push(message);
  return responseContent;
};

export default { analyzeLocation };
