import { FurnitureDetails } from "@/types/schemas";
import dedent from "dedent";
/**
 * Creates a dontation prompt for the location service.
 */
export const createDonationPrompt = (
  furnitureDetails: FurnitureDetails,
  location: string,
) => {
  if (furnitureDetails) {
    return dedent`
    Tässä on tiedot käyttäjän huonekalun analyysin ja hinnoittelun tuloksista:
    
    Analyysi:
    Merkki: ${furnitureDetails.merkki}
    Malli: ${furnitureDetails.malli}
    Väri: ${furnitureDetails.vari}
    Mitat: ${furnitureDetails.mitat.pituus}x${furnitureDetails.mitat.leveys}x${furnitureDetails.mitat.korkeus} cm
    Materiaalit: ${furnitureDetails.materiaalit}
    Kunto: ${furnitureDetails.kunto}

    Palauta lista paikoista tämän sijainnin "${location}" läheisyydessä, joissa huonekalun voisi lahjoittaa.
  `;
  }
  return null;
};

/**
 * Creates a recycle prompt for the location service.
 */
export const createRecyclePrompt = (
  furnitureDetails: FurnitureDetails,
  location: string,
) => {
  if (furnitureDetails) {
    return dedent`
    Tässä on tiedot käyttäjän huonekalun analyysin ja hinnoittelun tuloksista:
    
    Analyysi:
    Merkki: ${furnitureDetails.merkki}
    Malli: ${furnitureDetails.malli}
    Väri: ${furnitureDetails.vari}
    Mitat: ${furnitureDetails.mitat.pituus}x${furnitureDetails.mitat.leveys}x${furnitureDetails.mitat.korkeus} cm
    Materiaalit: ${furnitureDetails.materiaalit}
    Kunto: ${furnitureDetails.kunto}
  
    Palauta lista paikoista tämän sijainnin "${location}" läheisyydessä, joissa huonekalun voisi kierrättää.
  `;
  }
  return null;
};

/**
 * Creates a repair prompt for the location service.
 */
export const createRepairPrompt = (
  furnitureDetails: FurnitureDetails,
  location: string,
) => {
  if (furnitureDetails) {
    return dedent`
    Tässä on tiedot käyttäjän huonekalun analyysin ja hinnoittelun tuloksista:
    
    Analyysi:
    Merkki: ${furnitureDetails.merkki}
    Malli: ${furnitureDetails.malli}
    Väri: ${furnitureDetails.vari}
    Mitat: ${furnitureDetails.mitat.pituus}x${furnitureDetails.mitat.leveys}x${furnitureDetails.mitat.korkeus} cm
    Materiaalit: ${furnitureDetails.materiaalit}
    Kunto: ${furnitureDetails.kunto}
  
    Palauta lista paikoista tämän sijainnin "${location}" läheisyydessä, joissa huonekalun voisi korjauttaa.
  `;
  }
  return null;
};

/**
 * New prompts that are currently in use with the new pipelines & priceAnalyzer
 * Above are the old prompts that are not in use anymore but kept for reference
 */
export const analyzeImagePrompt =
  "Analysoi tämä suomalainen huonekalu ja tunnista sen tiedot. Mikäli et pysty tunnistamaan kenttää palauta 'Ei tiedossa'. Älä arvaa";

// Hieman erillainen tiukempi prompt Gemini15 mallille, koska antaa höpö höpö vastauksia muuten malliksi välillä.
export const analyzeImagePromptGemini15 =
  "Analyze this most likely scandinavian furniture piece and identify its details. Be extremely precise with the model identification - if you are not completely certain about any detail, return 'Ei tiedossa'. It is critical that you do not make assumptions or guesses about the model. It is better to return 'Ei tiedossa' than to risk misidentification.";

// GPT4o jättää kunnon aina ei tiedossa jos käytämme lopussa "Älä arvaa" ohjetta siksi oma prompt
export const analyzeImagePromptGPT4o =
  "Analysoi tämä suomalainen huonekalu ja tunnista sen tiedot. Mikäli et pysty tunnistamaan kenttää palauta 'Ei tiedossa'.";

// Jos pipeline ei ole löytänyt vastausta kutsumme vielä kerran GPT4o uusinta mallia tällä promptilla ja pyydämme antamaan parhaan arvionsa huonekalun brändille vähintään
export const finalAnalyzePromptGPT4o = `Analysoi tämä huonekalu mahdollisimman tarkasti ja palauta valmistajan nimi merkki-kenttään. 

Tämä on viimeinen tunnistusyritys, joten anna aina jokin valmistajan nimi vähintään. Mallia ei tarvitse tunnistaa ellet ole varma, mutta anna paraus arvauksesi jos sinulla on hyvä epäilys - älä palauta "Ei tiedossa" merkille.

Analyysin vaiheet:
1. Tutki huonekalun muotokieltä, materiaaleja ja yksityiskohtia
2. Vertaa näitä piirteitä tunnettuihin suomalaisiin ja pohjoismaisiin valmistajiin
3. Palauta parhaiten sopivan valmistajan nimi
`;

// Optimoitu prompt fine-tuning-käyttöön
export const analyzeImagePromptFineTuning =
  "Analysoi tämä huonekalu ja tunnista sen merkki ja malli. Vastaa JSON-muodossa ja käytä 'Ei tiedossa', jos et ole varma.";
