import gemini from "../../configs/gemini";
import { PriceAnalysisResponse, FurnitureDetails, ToriPrices } from "../../utils/types";
import getAvgPricesPerCondition from "../Tori/toriScraper";

const createPrompt = (furnitureDetails: FurnitureDetails, toriPrices: ToriPrices): string => `
  Kuvassa näkyvän huonekalun kuvaus:

  Huonekalun valmistaja on ${furnitureDetails.merkki} ja sen malli on ${furnitureDetails.malli}.
  Huonekalun väri on ${furnitureDetails.väri}. Huonekalun arvioidut mitat ovat ${furnitureDetails.mitat.pituus}x${furnitureDetails.mitat.leveys}x${furnitureDetails.mitat.korkeus} cm.
  Huonekalussa on käytetty ${furnitureDetails.materiaalit} materiaaleja. Huonekalun kunto on ${furnitureDetails.kunto}.

  Anna hinta-arvio huonekalulle käytettyjen tavaroiden markkinoilla annetun kuvauksen ja kuvan perusteella. Kyseessä olevat käytettyjen tavaroiden markkinat sijaitsevat Suomessa.
  Hyödynnä seuraavaa tietoa hinta-arvion tekemiseen: 
  Kuntoluokittainen hintakeskiarvo: ${toriPrices}. Tämä tieto sisältää kyseisen huonekalun keskihinnan ja huonekalujen määrän eri kuntoluokituksissa Tori.fi -palvelussa.

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

const parsePriceResponse = (responseText: string): PriceAnalysisResponse => {
  const cleanedText = responseText
    .replace(/```json\n?|\n?```/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return JSON.parse(cleanedText) as PriceAnalysisResponse;
};

const analyzePriceEstimate = async (
  imageBase64: string,
  furnitureDetails: FurnitureDetails
): Promise<PriceAnalysisResponse | { error: string }> => {
  try {
    const toriPrices = await getAvgPricesPerCondition(furnitureDetails.merkki, furnitureDetails.malli);
    const prompt = !('error' in toriPrices) 
      ? createPrompt(furnitureDetails, toriPrices) 
      : createPrompt(furnitureDetails, {});
    const result = await gemini.model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: "image/jpeg", data: imageBase64 } },
    ]);

    const response = result.response;
    const text = response.text();

    const parsedResponse = parsePriceResponse(text);
    return parsedResponse;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "An unexpected error occurred during price analysis." };
  }
};

export default analyzePriceEstimate;
