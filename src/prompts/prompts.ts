import dedent from "dedent";
import { FurnitureDetails } from "../types/schemas";
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

export const analyzeImagePrompt =
  "Analysoi tämä suomalainen huonekalu ja tunnista sen tiedot. Mikäli et pysty tunnistamaan kenttää palauta 'Ei tiedossa'. Älä arvaa";

// GPT4o jättää kunnon aina ei tiedossa jos käytämme lopussa "Älä arvaa" ohjetta siksi oma prompt
export const analyzeImagePromptGPT4o =
  "Analysoi tämä suomalainen huonekalu ja tunnista sen tiedot. Mikäli et pysty tunnistamaan kenttää palauta 'Ei tiedossa'.";
