import openai from "../../configs/openai";
import imageServiceOpenAI from "./imageService";
import { ChatResponse } from "../../utils/types";
import { chatResponseSchema } from "../../utils/schemas";
import { createChatPrompt } from "../../prompts/prompts";

// Function for asking a question from the OpenAI model
const askQuestion = async (
  requestId: string,
  question: string
): Promise<ChatResponse | { error: string }> => {
  // Retrieve the stored context for the specific furniture analysis
  const context = imageServiceOpenAI.conversationHistory[requestId];

  if (!context) {
    return { error: "No analysis found for this requestId" };
  }

  // TODO: ponder about this?
  if ("error" in context.furnitureDetails!) {
    return { error: "No furniture details in context" };
  }

  if ("error" in context.price!) {
    return { error: "No price in context" };
  }

  const prompt = createChatPrompt(context, question);

  context.messages.push({ role: "user", content: question });

  try {
    const response = await openai.client.chat.completions.create({
      model: openai.model,
      messages: [
        {
          role: "system",
          content:
            "Olet ammattilainen huonekalujen analysoimisessa ja annat vastauksia käyttäjän kysymyksiin hänen huonekaluunsa liittyen. Jos käyttäjä kysyy jotakin, joka ei liity huonekaluun, voit vastata 'En osaa vastata kysymykseesi'.",
        },
        ...context.messages,
        { role: "user", content: prompt },
      ],
    });

    const answer = response.choices[0].message.content;

    if (answer === null) {
      return { error: "Error returning an answer to the question" };
    }

    const parsedAnswer = chatResponseSchema.parse({ requestId, answer });

    context.messages.push({ role: "assistant", content: parsedAnswer.answer });

    return parsedAnswer;
  } catch (error) {
    console.error("Error in Q&A process: ", error);
    return { error: "Error processing the question" };
  }
};

export default askQuestion;
