import dedent from "dedent";
import { zodResponseFormat } from "openai/helpers/zod";
import { resizeImage } from "../../utils/resizeImage";
import { furnitureDetailsSchema } from "../../utils/schemas";
import openai from "../../configs/openai";

const prompt = dedent` 
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

// Function to analyze the provided image using OpenAI's GPT model, extracting furniture details
const analyzeImageOpenAI = async (imagePath: Buffer) => {
  try {
    // Get resized and optimized image
    const optimizedBase64Img = await resizeImage(imagePath);

    // Send request to OpenAI
    const response = await openai.client.chat.completions.create({
      model: openai.model,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: prompt,
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${optimizedBase64Img}`,
                detail: "auto",
              },
            },
          ],
        },
      ],
      response_format: zodResponseFormat(
        furnitureDetailsSchema,
        "furniture_analysis"
      ),
    });

    // Extract response content into a variable
    const messageContent = response.choices[0].message.content;

    if (messageContent === null) {
      throw new Error("Message content is null");
    }

    // Parse the response to be in the format defined in zod schema
    const furnitureAnalysis = furnitureDetailsSchema.parse(
      JSON.parse(messageContent)
    );

    return furnitureAnalysis;
  } catch (error) {
    // Handle any errors during the request
    if (error instanceof Error) {
      return { error: error.message };
    } else {
      return { error: "An unknown error occurred" };
    }
  }
};

export default analyzeImageOpenAI;
