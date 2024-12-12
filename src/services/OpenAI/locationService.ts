import { FurnitureDetails, LocationQuery } from "../../utils/types";
import imageServiceOpenAI from "./imageService";
import openai from "../../configs/openai";
import { ChatCompletionMessageParam } from "openai/resources";
import {
  createDonationPrompt,
  createRecyclePrompt,
  createRepairPrompt,
} from "../../prompts/prompts";

const createPrompt = (
  data: LocationQuery,
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

const analyzeLocation = async (data: LocationQuery) => {
  const context = imageServiceOpenAI.conversationHistory[data.requestId];
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
