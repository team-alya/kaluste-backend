import dedent from "dedent";
import openai from "../../configs/openai";
import imageServiceOpenAI from "./imageServiceOpenAI";
import { ChatResponse } from "../../utils/types";

// Function for asking a question from the OpenAI model
const askQuestion = async (
  requestId: string,
  question: string
): Promise<ChatResponse | { error: string }> => {
  // Retrieve the stored context for the specific furniture analysis
  const context = imageServiceOpenAI.conversationHistory[requestId];

  // Check if the context exists
  if (!context) {
    return { error: "No analysis found for this requestId" };
  }

  // Ensure context.analysis is of type FurnitureDetails
  if ("error" in context.furnitureDetails) {
    return { error: context.furnitureDetails.error };
  }

  // Ensure context.price is of type PriceAnalysisResponse
  if ("error" in context.price) {
    return { error: context.price.error };
  }

  // Construct the prompt with the context
  const prompt = dedent`
    Tässä on tiedot käyttäjän huonekalusta ja hinta-analyysin tuloksista:
    
    Huonekalun tiedot:
    Merkki: ${context.furnitureDetails.merkki}
    Malli: ${context.furnitureDetails.malli}
    Väri: ${context.furnitureDetails.väri}
    Mitat: ${context.furnitureDetails.mitat.pituus}x${context.furnitureDetails.mitat.leveys}x${context.furnitureDetails.mitat.korkeus} cm
    Materiaalit: ${context.furnitureDetails.materiaalit}
    Kunto: ${context.furnitureDetails.kunto}
    
    Hinta-analyysi:
    Korkein hinta: ${context.price.korkein_hinta} €
    Alin hinta: ${context.price.alin_hinta} €
    Myyntikanavat: ${context.price.myyntikanavat}

    Käyttäjän kysymys: ${question}

    Anna vastaus merkkijonona ilman muotoiluja. 
  `;

  // Append the question to the conversation history
  context.messages.push({ role: "user", content: question });

  try {
    // Make a call to OpenAI with the context and question
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

    // Get the answer from the response
    const answer = response.choices[0].message.content;

    // Check if the answer is null
    if (answer === null) {
      return { error: "Error returning an answer to the question" };
    }

    // Store the assistant's answer in the conversation history
    context.messages.push({ role: "assistant", content: answer });

    return { answer };
  } catch (error) {
    console.error("Error in Q&A process: ", error);
    return { error: "Error processing the question" };
  }
};

export default askQuestion;
