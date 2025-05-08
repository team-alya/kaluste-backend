import {
  brandModelSchema,
  FurnitureDetails,
  furnitureDetailsSchema,
} from "@/types/schemas";
import { AIAnalyzer } from "@/types/services";
import { AnalysisTimer } from "@/utils/timer";
import { openai } from "@ai-sdk/openai";
import { generateObject, generateText } from "ai";
import dotenv from "dotenv";
dotenv.config();

export class O3Analyzer implements AIAnalyzer {
  name = "O3-Reasoning";
  reasoningEffort: "low" | "medium" | "high";

  constructor(reasoningEffort: "low" | "medium" | "high" = "high") {
    this.reasoningEffort = reasoningEffort;
  }

  async analyze(imageBuffer: Buffer): Promise<FurnitureDetails> {
    try {
      const timer = new AnalysisTimer(
        `${this.name} with reasoning effort: ${this.reasoningEffort}`
      );

      // Step 1: Use O3 to identify just the brand and model
      console.log(
        `[${new Date().toISOString()}] Step 1: Identifying brand and model with O3...`
      );
      const brandModelResult = await generateObject({
        model: openai.responses("o3"),
        schema: brandModelSchema,
        output: "object",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                // text: "Tunnista merkki ja malli",
                text: "Tunnista tämän sisustustuotteen suomalaisen (huonekalu tai koriste-esine) tiedot. Anna paras arvio merkistä ja mallista;",
              },
              {
                type: "image",
                image: imageBuffer,
              },
            ],
          },
        ],
        providerOptions: {
          openai: {
            reasoningEffort: this.reasoningEffort,
          },
        },
      });

      console.log(
        `[${new Date().toISOString()}] O3 identified brand: "${brandModelResult.object.merkki}", model: "${brandModelResult.object.malli}"`
      );

      // Step 2: Use web search to find measurements and specifications
      console.log(
        `[${new Date().toISOString()}] Step 2: Searching web for furniture measurements...`
      );

      const searchResult = await generateText({
        model: openai.responses("gpt-4.1"),
        prompt: `Etsi internetistä esineen "${brandModelResult.object.merkki} ${brandModelResult.object.malli}" tarkat mitat, materiaalit ja muut tekniset tiedot. 
        Keskity erityisesti mittoihin (leveys, korkeus, syvyys) ja materiaaleihin. Vastaa suomeksi lyhyesti vain faktoilla ilman ylimääräistä selitystä.`,
        tools: {
          web_search_preview: openai.tools.webSearchPreview(),
        },
      });

      // Step 3: Use GPT-4.1 to generate the full details using all information
      console.log(
        `[${new Date().toISOString()}] Step 3: Generating full furniture details with GPT-4.1...`
      );
      const result = await generateObject({
        model: openai("gpt-4.1"),
        schema: furnitureDetailsSchema,
        output: "object",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Analysoi tämä sisustustuote ja täytä scheman kentät. Vastaa VAIN suomen kielellä.
            Tiedämme että merkki on "${brandModelResult.object.merkki}" ja malli on "${brandModelResult.object.malli}".
            
            Tässä internetistä löydetyt tiedot tuotteesta:
            ${searchResult.text}
            
            Käytä näitä tietoja täydentämään analyysia. Jos internetistä löydetyt tiedot ovat ristiriidassa kuvan kanssa, 
            priorisoi kuvan tietoja. Keskity analysoimaan väri, mitat, materiaalit ja kunto tarkasti. Kaikki kentät tulee täyttää suomeksi.`,
              },
              {
                type: "image",
                image: imageBuffer,
              },
            ],
          },
        ],
      });

      timer.stop(result.object.merkki, result.object.malli);
      return result.object;
    } catch (error) {
      const timer = new AnalysisTimer(this.name);
      timer.logError(error);
      throw error;
    }
  }
}
