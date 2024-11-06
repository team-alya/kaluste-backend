import dedent from "dedent";
import { FurnitureDetails, PriceAnalysisResponse } from "../../utils/types";
import imageServiceOpenAI from "./imageServiceOpenAI";
import openai from "../../configs/openai";

const createPrompt = (furnitureDetails: FurnitureDetails) => dedent`
  Kuvassa näkyvän huonekalun kuvaus:

  Huonekalun valmistaja on ${furnitureDetails.merkki} ja sen malli on ${furnitureDetails.malli}.
  Huonekalun väri on ${furnitureDetails.väri}. Huonekalun arvioidut mitat ovat ${furnitureDetails.mitat.pituus}x${furnitureDetails.mitat.leveys}x${furnitureDetails.mitat.korkeus} cm.
  Huonekalussa on käytetty ${furnitureDetails.materiaalit} materiaaleja. Huonekalun kunto on ${furnitureDetails.kunto}.

  Anna hinta-arvio huonekalulle käytettyjen tavaroiden markkinoilla annetun kuvauksen ja kuvan perusteella. Kyseessä olevat käytettyjen tavaroiden markkinat sijaitsevat Suomessa. 
  Palauta 2 hintaa ja 1 lista myyntikanavista JSON-oliona sisältäen seuraavat arvot: korkein_hinta, alin_hinta, myyntikanavat.
  myyntikanavat tulisi olla lista, joka sisältää merkkijonoja kanavista, joilla käyttäjä voisi myydä huonekalun (esim. Tori, Mjuk)
  Muotoile vastaus JSON oliona.

  Esimerkkivastausmuoto:
  {
    "korkein_hinta": korkein hinta euroina,
    "alin_hinta": alin hinta euroina,
    "myyntikanavat": ["Tori", "Mjuk"]
  }
`;

const analyzePrice = async (requestId: string, imageBase64: string) => {
  const context = imageServiceOpenAI.conversationHistory[requestId];

  const conversationItem = context.messages[2];

  if (!conversationItem || !conversationItem.content) {
    return { error: "No valid furniture analysis found in context" };
  }

  if (typeof conversationItem.content !== "string") {
    return { error: "Invalid content format" };
  }

  const furnitureDetails: FurnitureDetails = JSON.parse(
    conversationItem.content
  );

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
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: "auto",
              },
            },
          ],
        },
      ],
    });

    const responseContent = result.choices[0].message.content;

    if (responseContent === null) {
      throw new Error("Error analyzing price");
    }

    context.price = JSON.parse(responseContent) as PriceAnalysisResponse;

    context.messages.push({
      role: "assistant",
      content: responseContent,
    });

    return responseContent;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      return { error: error.message };
    }
  }
  return;
};

export default analyzePrice;
