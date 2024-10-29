import dedent from "dedent";
import { zodResponseFormat } from "openai/helpers/zod";
import { resizeImage } from "../../utils/resizeImage";
import { furnitureDetailsSchema } from "../../utils/schemas";
import openai from "../../configs/openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { FurnitureDetails } from "../../utils/types";
import { v4 as uuidv4 } from "uuid";
import analyzePrice from "./priceServiceOpenAI";

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

const conversationHistory: {
  [key: string]: ChatCompletionMessageParam[];
} = {};

// Function to analyze the provided image using OpenAI's GPT model, extracting furniture details
const analyzeImageOpenAI = async (
  imagePath: Buffer
): Promise<FurnitureDetails | { error: string }> => {
  try {
    const requestId = uuidv4();

    // Get resized and optimized image
    const optimizedBase64Img = await resizeImage(imagePath);

    conversationHistory[requestId] = [];

    // Add user prompt to conversation history
    conversationHistory[requestId].push({
      role: "user",
      content: prompt,
    });

    // Add user image to conversation history
    conversationHistory[requestId].push({
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
    });

    // Send request to OpenAI
    const response = await openai.client.chat.completions.create({
      model: openai.model,
      messages: conversationHistory[requestId],
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

    conversationHistory[requestId].push({
      role: "assistant",
      content: JSON.stringify(furnitureAnalysis),
    });

    const priceRes = await analyzePrice(requestId, optimizedBase64Img);

    console.log("Response from analyzePrice: ", priceRes);

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

export default { analyzeImageOpenAI, conversationHistory };
