import dedent from "dedent";
import { FurnitureDetails, LocationQuery } from "../../utils/types";
import imageServiceOpenAI from "./imageService";
import openai from "../../configs/openai";
import { ChatCompletionMessageParam } from "openai/resources";

const createDonationPrompt = (
  furnitureDetails: FurnitureDetails,
  location: string
) => {
  if (furnitureDetails) {
    return dedent`
    Tässä on tiedot käyttäjän huonekalun analyysin ja hinnoittelun tuloksista:
    
    Analyysi:
    Merkki: ${furnitureDetails.merkki}
    Malli: ${furnitureDetails.malli}
    Väri: ${furnitureDetails.väri}
    Mitat: ${furnitureDetails.mitat.pituus}x${furnitureDetails.mitat.leveys}x${furnitureDetails.mitat.korkeus} cm
    Materiaalit: ${furnitureDetails.materiaalit}
    Kunto: ${furnitureDetails.kunto}

    Palauta lista paikoista tämän sijainnin "${location}" läheisyydessä, joissa huonekalun voisi lahjoittaa.
  `;
  }
  return null;
};

const createRecyclePrompt = (
  furnitureDetails: FurnitureDetails,
  location: string
) => {
  if (furnitureDetails) {
    return dedent`
    Tässä on tiedot käyttäjän huonekalun analyysin ja hinnoittelun tuloksista:
    
    Analyysi:
    Merkki: ${furnitureDetails.merkki}
    Malli: ${furnitureDetails.malli}
    Väri: ${furnitureDetails.väri}
    Mitat: ${furnitureDetails.mitat.pituus}x${furnitureDetails.mitat.leveys}x${furnitureDetails.mitat.korkeus} cm
    Materiaalit: ${furnitureDetails.materiaalit}
    Kunto: ${furnitureDetails.kunto}
  
    Palauta lista paikoista tämän sijainnin "${location}" läheisyydessä, joissa huonekalun voisi kierrättää.
  `;
  }
  return null;
};

const createRepairPompt = (
  furnitureDetails: FurnitureDetails,
  location: string
) => {
  if (furnitureDetails) {
    return dedent`
    Tässä on tiedot käyttäjän huonekalun analyysin ja hinnoittelun tuloksista:
    
    Analyysi:
    Merkki: ${furnitureDetails.merkki}
    Malli: ${furnitureDetails.malli}
    Väri: ${furnitureDetails.väri}
    Mitat: ${furnitureDetails.mitat.pituus}x${furnitureDetails.mitat.leveys}x${furnitureDetails.mitat.korkeus} cm
    Materiaalit: ${furnitureDetails.materiaalit}
    Kunto: ${furnitureDetails.kunto}
  
    Palauta lista paikoista tämän sijainnin "${location}" läheisyydessä, joissa huonekalun voisi korjauttaa.
  `;
  }
  return null;
};

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
      prompt = createRepairPompt(furnitureDetails, location);
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
