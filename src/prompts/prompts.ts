import dedent from "dedent";
import { FurnitureDetails, ToriPrices, UserConversation } from "../utils/types";

/**
 * Creates a prompt for the chat service.
 */
export const createChatPrompt = (context: UserConversation, question: string) =>
  dedent`
    Tässä on tiedot käyttäjän huonekalusta ja hinta-analyysin tuloksista:
    
    Huonekalun tiedot:
    Merkki: ${context.furnitureDetails!.merkki}
    Malli: ${context.furnitureDetails!.malli}
    Väri: ${context.furnitureDetails!.väri}
    Mitat: ${context.furnitureDetails!.mitat.pituus}x${
    context.furnitureDetails!.mitat.leveys
  }x${context.furnitureDetails!.mitat.korkeus} cm
    Materiaalit: ${context.furnitureDetails!.materiaalit}
    Kunto: ${context.furnitureDetails!.kunto}
        
    Hinta-analyysi:
    Korkein hinta: ${context.price!.korkein_hinta} €
    Alin hinta: ${context.price!.alin_hinta} €
    Myyntikanavat: ${context.price!.myyntikanavat}
        
    Käyttäjän kysymys: ${question}
        
    Anna vastaus merkkijonona ilman muotoiluja. 
`;

/**
 * Creates a prompt for the image analysis service.
 */
export const createImagePrompt = () => dedent` 
 Analysoi kuvassa näkyvä huonekalu ja anna seuraavat tiedot:

    - merkki: Huonekalun valmistaja tai suunnittelija (esim. "Ikea", "Artek"). Jos ei tunnistettavissa, palauta "Tuntematon"
    - malli: Spesifi mallinimi tai -numero (esim. "Eames Lounge Chair", "Poäng"). Jos ei tunnistettavissa, palauta "Tuntematon"
    - väri: Huonekalun pääväri tai selkein näkyvä väri (esim. "musta", "beige")
    - mitat: Olio, jolla on arvoina pituus, leveys ja korkeus senttimetreinä (älä sisällytä 'cm' arvoihin)
    - materiaalit: Lista materiaaleista, jotka ovat näkyvissä huonekalussa (esim. ["Puu", "Alumiini", "Kangas"])
    - kunto: Huonekalun kunto arvioituna yhdellä seuraavista: "Erinomainen", "Hyvä", "Kohtalainen", "Huono"

    Palauta vastaus JSON-muotoisena oliona

    Varmista, että kaikki tekstiarvot alkavat isolla alkukirjaimella.
    Jos et pysty tunnistamaan jotakin huonekalun yksityiskohtaa tai yksityiskohtaa ei ole selvästi näkyvissä, palauta "Tuntematon" tekstikentille.
    Anna aina paras arviosi mitoille, vaikka et ole täysin varma.

    Jos kuvassa ei ole huonekaluja tai huonekalua ei voi tunnistaa, palauta olio, jossa on seuraava muoto:
    {
      "virhe": "Huonekalua ei voitu tunnistaa tai kuvassa ei ole huonekaluja.
    }

`;

/**
 * Creates a dontation prompt for the location service.
 */
export const createDonationPrompt = (
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

/**
 * Creates a recycle prompt for the location service.
 */
export const createRecyclePrompt = (
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

/**
 * Creates a repair prompt for the location service.
 */
export const createRepairPrompt = (
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

// TODO: Add error field to prompt to be displayed when Tori.fi prices aren't found
/**
 * Creates a prompt for the price service.
 */
export const createPricePrompt = (
  furnitureDetails: FurnitureDetails,
  toriPrices: ToriPrices
) => dedent`
  # HUONEKALUN HINTA-ARVIOPYYNTÖ 

  ## HUONEKALUN TIEDOT
  - Valmistaja: ${furnitureDetails.merkki}
  - Malli: ${furnitureDetails.malli}
  - Väri: ${furnitureDetails.väri}
  - Mitat: ${furnitureDetails.mitat.pituus}x${furnitureDetails.mitat.leveys}x${
  furnitureDetails.mitat.korkeus
} cm
  - Materiaalit: ${furnitureDetails.materiaalit}
  - Kunto: ${furnitureDetails.kunto}

  ## TARKAT TORI.FI MARKKINATIEDOT
  Ajantasaiset Tori.fi markkinatilastot tämän tyyppiselle huonekalulle:
  ${JSON.stringify(toriPrices, null, 2)}
  TÄRKEÄÄ: Kopio nämä tarkat arvot vastauksen kohtaan tori_hinnat.

  ## VAADITTU LOPPUTULOS
  Anna hinta-arvio JSON näiden vaatimusten perusteella:
  1. Käytä tori_hinnat kohdassa annettua Tori.fi dataa (jos dataa ei ole saatavilla älä palauta mitään tori_hintoihin)
  2. Anna hinta-arvio huonekalulle käytettyjen tavaroiden markkinoilla annetun kuvauksen ja kuvan perusteella. Kyseessä olevat käytettyjen tavaroiden markkinat sijaitsevat Suomessa.
  3. Vastauksen muodon tulee olla: 
  {
    "korkein_hinta": <korkein hinta euroina>,
    "alin_hinta": <alin hinta euroina>,
    "myyntikanavat": <lista myyntikanavista>
    "tori_hinnat": {
      <kunto>: [<keskiarvoinen_hinta>, <kappalemäärä>]
  }

  ## VALIDAATIOSÄÄNNÖT
  1. Kaikki hinnat tulee olla euroina
  2. tori_hinnat tulee vastata annettua Tori.fi dataa
`;
