import dedent from "dedent";
import openai from "../../configs/openai";
import imageServiceOpenAI from "./imageServiceOpenAI";

// parseAnswer function to clean up the answer from OpenAI
const parseAnswer = (answer: string): string => {
  console.log("Raw answer: ", answer);
  const cleanedText = answer
    .replace(/```json\n?|\n?```/g, "")
    .replace(/\s+/g, " ")
    .trim();
  console.log("Cleaned answer: ", cleanedText);
  return cleanedText;
};

// Function for asking a question from the OpenAI model
const askQuestion = async (requestId: string, question: string) => {
  // Retrieve the stored context for the specific furniture analysis
  const context = imageServiceOpenAI.conversationHistory[requestId];

  // Check if the context exists
  if (!context) {
    return { error: "No analysis found for this requestId" };
  }

  // Ensure context.analysis is of type FurnitureDetails
  if ("error" in context.analysis) {
    return { error: context.analysis.error };
  }

  // Ensure context.price is of type PriceAnalysisResponse
  if ("error" in context.price) {
    return { error: context.price.error };
  }

  // Construct the prompt with the context
  const prompt = dedent`
    Tässä on tiedot käyttäjän huonekalun analyysin ja hinnoittelun tuloksista:
    
    Analyysi:
    Merkki: ${context.analysis.merkki}
    Malli: ${context.analysis.malli}
    Väri: ${context.analysis.väri}
    Mitat: ${context.analysis.mitat.pituus}x${context.analysis.mitat.leveys}x${context.analysis.mitat.korkeus} cm
    Materiaalit: ${context.analysis.materiaalit}
    Kunto: ${context.analysis.kunto}
    
    Hinta-analyysi:
    Korkein hinta: ${context.price.korkein_hinta} €
    Alin hinta: ${context.price.alin_hinta} €
    Myyntikanavat: ${context.price.myyntikanavat}

    Kysymys: ${question}

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
            "Olet ammattilainen huonekalujen analysoimisessa ja annat vastauksia käyttäjän kysymyksiin hänen huonekaluunsa liittyen.",
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

    // Parse the answer and log it
    const parsedAnswer = parseAnswer(answer);
    console.log("Parsed answer: ", parsedAnswer);

    // Store the assistant's answer in the conversation history
    context.messages.push({ role: "assistant", content: parsedAnswer });

    // Log the whole context after the question is answered
    console.log("Context after question:", context);

    return { answer };
  } catch (error) {
    console.error("Error in Q&A process: ", error);
    return { error: "Error processing the question" };
  }
};

export default askQuestion;
