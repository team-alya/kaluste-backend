import gemini from "../../configs/gemini";
import { FurnitureDetails, RepairAnalysisResponse } from "../../utils/types";

const createPrompt = (furnitureDetails: FurnitureDetails) => `
  Kuvassa näkyvän huonekalun kuvaus:

  Huonekalun valmistaja on ${furnitureDetails.merkki} ja sen malli on ${furnitureDetails.malli}.
  Huonekalun väri on ${furnitureDetails.väri}. Huonekalun arvioidut mitat ovat ${furnitureDetails.mitat.pituus}x${furnitureDetails.mitat.leveys}x${furnitureDetails.mitat.korkeus} cm.
  Huonekalussa on käytetty ${furnitureDetails.materiaalit} materiaaleja. Huonekalun kunto on ${furnitureDetails.kunto}.

  Anna ohjeita, miten kunnostaa/korjata tai kierrättää huonekalu annetun kuvauksen ja kuvan perusteella. 
  Jos huonekalu on huonossa kunnossa, anna ohjeita kuinka kunnostaa/korjata se, tai jos se on korjauskelvoton anna ohjeita kuinka kierrättää se.
  Kiinnitä erityisesti huomiota huonekalun merkkiin, materiaaleihin, kuntoon ja vikoihin.
  Palauta ohjeet JSON-oliona sisältäen seuraavat arvot: korjaus_ohjeet, kierrätys_ohjeet
  korjaus_ohjeet kentän tulisi sisältää ohjeita siihen, kuinka huonekalun voisi kunnostaa tai korjata, jos tarpeen.
  kierrätys_ohjeet kentän tulisi sisältää ohjeita siihen, kuinka huonekalun voisi kierrättää Suomessa, jos tarpeen.

  Kenttien tekstit tulee olla ilman rivinvaihtoja. Vastausten muoto tulee olla johdonmukaisia.
  Muotoile vastaus JSON-oliona.
`;

const parseRepairResponse = (responseText: string) => {
  const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleanedText) as RepairAnalysisResponse;
};

const analyzeRepairEstimate = async (
  imageBase64: string,
  furnitureDetails: FurnitureDetails
) => {
  const prompt = createPrompt(furnitureDetails);

  try {
    const result = await gemini.model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
    ]);
    const response = result.response;
    const text = response.text();

    const parsedResponse = parseRepairResponse(text);
    return parsedResponse;
  } catch (error: unknown) {
    return {
      error: `An unexpected error occured during repair analysis. Message: ${
        (error as Error).message
      } `,
    };
  }
};

export default analyzeRepairEstimate;
