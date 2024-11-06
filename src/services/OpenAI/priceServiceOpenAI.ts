import dedent from "dedent";
import { FurnitureDetails, PriceAnalysisResponse } from "../../utils/types";
import imageServiceOpenAI from "./imageServiceOpenAI";
import openai from "../../configs/openai";
import { zodResponseFormat } from "openai/helpers/zod";
import { priceAnalysisSchema } from "../../utils/schemas";

const createPrompt = (furnitureDetails: FurnitureDetails) => dedent`
  Kuvassa näkyvän huonekalun kuvaus:

  requestId: ${furnitureDetails.requestId}

  Huonekalun valmistaja on ${furnitureDetails.merkki} ja sen malli on ${furnitureDetails.malli}.
  Huonekalun väri on ${furnitureDetails.väri}. Huonekalun arvioidut mitat ovat ${furnitureDetails.mitat.pituus}x${furnitureDetails.mitat.leveys}x${furnitureDetails.mitat.korkeus} cm.
  Huonekalussa on käytetty ${furnitureDetails.materiaalit} materiaaleja. Huonekalun kunto on ${furnitureDetails.kunto}.

  Anna hinta-arvio huonekalulle käytettyjen tavaroiden markkinoilla annetun kuvauksen ja kuvan perusteella. Kyseessä olevat käytettyjen tavaroiden markkinat sijaitsevat Suomessa. 
  Palauta 2 hintaa ja 1 lista myyntikanavista JSON-oliona sisältäen seuraavat arvot: korkein_hinta, alin_hinta, myyntikanavat.
  myyntikanavat tulisi olla lista, joka sisältää merkkijonoja kanavista, joilla käyttäjä voisi myydä huonekalun (esim. Tori, Mjuk)
  Muotoile vastaus JSON oliona.

  Esimerkkivastausmuoto:
  {
    "requestId": "${furnitureDetails.requestId}",
    "korkein_hinta": korkein hinta euroina,
    "alin_hinta": alin hinta euroina,
    "myyntikanavat": ["Tori", "Mjuk"]
  }
`;

const analyzePrice = async (
  furnitureDetails: FurnitureDetails
): Promise<PriceAnalysisResponse | { error: string }> => {
  // Retrieve the stored context for the specific furniture analysis
  const context =
    imageServiceOpenAI.conversationHistory[furnitureDetails.requestId];

  // Store the furniture details in the context
  context.furnitureDetails = furnitureDetails;

  // Check if the imageUrl is not found in the context
  if (!context.imageUrl) {
    return { error: "No valid image content found in context" };
  }

  // Extract the base64 image from the context
  const base64ImgUrl: string = context.imageUrl;

  // Create prompt for price analysis
  const prompt = createPrompt(furnitureDetails);

  try {
    const result = await openai.client.chat.completions.create({
      model: openai.model,
      messages: [
        {
          role: "system",
          content: "You are a furniture price analysis assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: base64ImgUrl,
                detail: "auto",
              },
            },
          ],
        },
      ],
      response_format: zodResponseFormat(priceAnalysisSchema, "price_analysis"),
    });

    // Extract response content into a variable
    const responseContent = result.choices[0].message.content;

    // Check if the message content is null
    if (responseContent === null) {
      throw new Error("Error analyzing price");
    }

    // Parse the response and store it in the context
    const parsedResponse = priceAnalysisSchema.parse(
      JSON.parse(responseContent)
    );
    context.price = parsedResponse;

    // Append the response to the conversation history
    context.messages.push({
      role: "assistant",
      content: responseContent,
    });

    return parsedResponse;
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "An unknown error occurred while analyzing price" };
    }
  }
};

export default analyzePrice;
