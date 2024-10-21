import { FurnitureDetails } from "../../utils/types";
import { resizeImage } from "../../utils/resizeImage";
import gemini from "../../configs/gemini";

// Function to create a prompt for the AI, including instructions
const createPrompt = () =>
  `
    Analysoi kuvassa näkyvä huonekalu ja anna seuraavat tiedot:

    - merkki: Huonekalun valmistaja tai suunnittelija (esim. "Ikea", "Artek")
    - malli: Spesifi mallinimi tai -numero (esim. "Eames Lounge Chair", "Poäng")
    - väri: Huonekalun pääväri tai selkein näkyvä väri (esim. "musta", "beige")
    - mitat: Olio, jolla on arvoina pituus, leveys ja korkeus senttimetreinä (älä sisällytä 'cm' arvoihin)
    - materiaalit: Lista materiaaleista, jotka ovat näkyvissä huonekalussa (esim. ["Puu", "Alumiini", "Kangas"])
    - kunto: Huonekalun kunto arvioituna yhdellä seuraavista: "Erinomainen", "Hyvä", "Kohtalainen", "Huono"

    Palauta vastaus JSON-muotoisena oliona

    Varmista, että kaikki tekstiarvot alkavat isolla alkukirjaimella.
    Jos et pysty tunnistamaan jotakin huonekalun yksityiskohtaa tai yksityiskohtaa ei ole selvästi näkyvissä, palauta "Tuntematon" tekstikentille.
    Anna paras arviosi mitoille, vaikka et ole täysin varma.

    Jos kuvassa ei ole huonekaluja tai huonekalua ei voi tunnistaa, palauta olio, jossa on seuraava muoto:
    {
      "virhe": "Huonekalua ei voitu tunnistaa tai kuvassa ei ole huonekaluja.
    }

    Esimerkkivastauksen muoto:
      {
        "merkki": "West Elm",
        "malli": "Hamilton",
        "väri": "Harmaa",
        "mitat": {
          "pituus": 218,
          "leveys": 94,
          "korkeus": 90
        },
        "materiaalit": ["Nahka"]
        "kunto": "Erinomainen",
      }
  `;

const parseImageResponse = (responseText: string): FurnitureDetails => {
  const cleanedText = responseText.replace(/```json\n?|\n?```/g, "").trim();
  return JSON.parse(cleanedText) as FurnitureDetails;
};

// Function to analyze the provided image using Gemini model, extracting furniture details
const analyzeImageGemini = async (
  imagePath: Buffer
): Promise<FurnitureDetails | { error: string }> => {
  const prompt = createPrompt();
  try {
    // Get resized and optimized image
    const optimizedBase64Img = await resizeImage(imagePath);

    // Send image and prompt to Gemini for analysis
    const result = await gemini.model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: "image/jpeg", data: optimizedBase64Img } },
    ]);

    // Ensure that a response was received
    if (!result) {
      throw new Error("No content returned from Gemini API");
    }

    // Parse the response
    const response = result.response;
    const text = response.text();

    const parsedResponse = parseImageResponse(text);

    return parsedResponse;
  } catch (error: unknown) {
    return {
      error: `An unexpected error occurred during image analysis. Message: ${
        (error as Error).message
      }`,
    };
  }
};

export default analyzeImageGemini;
