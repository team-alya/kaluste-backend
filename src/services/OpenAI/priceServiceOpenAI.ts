import dedent from "dedent";
import { FurnitureDetails, PriceAnalysisResponse } from "../../utils/types";
import imageServiceOpenAI from "./imageServiceOpenAI";
import openai from "../../configs/openai";

const createPrompt = (furnitureDetails: FurnitureDetails) => dedent`
  Kuvassa näkyvän huonekalun kuvaus:

  Pyynnön id: ${furnitureDetails.id}

  Huonekalun valmistaja on ${furnitureDetails.merkki} ja sen malli on ${furnitureDetails.malli}.
  Huonekalun väri on ${furnitureDetails.väri}. Huonekalun arvioidut mitat ovat ${furnitureDetails.mitat.pituus}x${furnitureDetails.mitat.leveys}x${furnitureDetails.mitat.korkeus} cm.
  Huonekalussa on käytetty ${furnitureDetails.materiaalit} materiaaleja. Huonekalun kunto on ${furnitureDetails.kunto}.

  Anna hinta-arvio huonekalulle käytettyjen tavaroiden markkinoilla annetun kuvauksen ja kuvan perusteella. Kyseessä olevat käytettyjen tavaroiden markkinat sijaitsevat Suomessa. 
  Palauta 2 hintaa ja 1 lista myyntikanavista JSON-oliona sisältäen seuraavat arvot: korkein_hinta, alin_hinta, myyntikanavat.
  myyntikanavat tulisi olla lista, joka sisältää merkkijonoja kanavista, joilla käyttäjä voisi myydä huonekalun (esim. Tori, Mjuk)
  Muotoile vastaus JSON oliona.

  Esimerkkivastausmuoto:
  {
    "id": "${furnitureDetails.id}",
    "korkein_hinta": korkein hinta euroina,
    "alin_hinta": alin hinta euroina,
    "myyntikanavat": ["Tori", "Mjuk"]
  }
`;

const parsePriceResponse = (responseText: string): PriceAnalysisResponse => {
  const cleanedText = responseText
    .replace(/```json\n?|\n?```/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return JSON.parse(cleanedText) as PriceAnalysisResponse;
};

const analyzePrice = async (furnitureDetails: FurnitureDetails) => {
  // Retrieve the stored context for the specific furniture analysis
  const context = imageServiceOpenAI.conversationHistory[furnitureDetails.id];


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
    });

    // Extract response content into a variable
    const responseContent = result.choices[0].message.content;

    // Check if the message content is null
    if (responseContent === null) {
      return { error: "Error analyzing price" };
    }

    // Parse the response and store it in the context
    const parsedResponse = parsePriceResponse(responseContent);
    context.price = parsedResponse;

    // Append the response to the conversation history
    context.messages.push({
      role: "assistant",
      content: JSON.stringify(parsedResponse),
    });

    return parsedResponse;
  } catch (error) {
    console.error("Error analyzing price: ", error);
    return { error: "Error analyzing price" };
  }
};

export default analyzePrice;
