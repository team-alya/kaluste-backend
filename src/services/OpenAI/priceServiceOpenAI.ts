import dedent from "dedent";
import { FurnitureDetails, PriceAnalysisResponse } from "../../utils/types";
import imageServiceOpenAI from "./imageServiceOpenAI";

const createPrompt = (
  requestId: string,
  furnitureDetails: FurnitureDetails
): string => dedent`
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

const analyzePrice = async (
  requestId: string
): Promise<PriceAnalysisResponse | { error: string }> => {
  const conversationItem = imageServiceOpenAI.conversationHistory[requestId][2];

  const furnitureDetails = JSON.parse(
    conversationItem.content
  ) as FurnitureDetails;

  const prompt = createPrompt(requestId, furnitureDetails);
};

export default analyzePrice;
