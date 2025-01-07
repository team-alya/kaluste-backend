/*
This was the first version of price analyzer. Arvolaskuri uses priceAnalyzer from kaluste-backend/src/services/ai/priceAnalyzer currently.
Which is a bit different from this one. It uses Perplexity API for price analysis.
*/
import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import {
  FurnitureDetails,
  PriceAnalysis,
  priceAnalysisSchema,
} from "../../types/schemas";

interface PriceAnalyzer {
  name: string;
  analyze: (details: FurnitureDetails) => Promise<PriceAnalysis>;
}

class GPT4PriceAnalyzer implements PriceAnalyzer {
  name = "GPT-4";

  async analyze(details: FurnitureDetails): Promise<PriceAnalysis> {
    const result = await generateObject({
      model: openai("gpt-4o-2024-11-20"),
      schema: priceAnalysisSchema,
      temperature: 0,
      messages: [
        {
          role: "system",
          content: "Olet huonekalujen hinta-analysoija Suomen markkinoilla.",
        },
        {
          role: "user",
          content: `
            Analysoi tämän huonekalun hinta käytettyjen tavaroiden markkinoilla:
            - Merkki: ${details.merkki}
            - Malli: ${details.malli}
            - Väri: ${details.vari}
            - Mitat: ${details.mitat.pituus}x${details.mitat.leveys}x${details.mitat.korkeus} cm
            - Materiaalit: ${details.materiaalit.join(", ")}
            - Kunto: ${details.kunto}
            
            Anna hinta-arvio huomioiden tuotteen ominaisuudet ja nykyiset markkinahinnat Suomessa.
          `,
        },
      ],
    });

    return result.object;
  }
}

class GeminiPriceAnalyzer implements PriceAnalyzer {
  name = "Gemini";

  async analyze(details: FurnitureDetails): Promise<PriceAnalysis> {
    const result = await generateObject({
      model: google("gemini-2.0-flash-exp"),
      schema: priceAnalysisSchema,
      temperature: 0,
      messages: [
        {
          role: "system",
          content: "Olet huonekalujen hinta-analysoija Suomen markkinoilla.",
        },
        {
          role: "user",
          content: `
            Analysoi tämän huonekalun hinta käytettyjen tavaroiden markkinoilla:
            - Merkki: ${details.merkki}
            - Malli: ${details.malli}
            - Väri: ${details.vari}
            - Mitat: ${details.mitat.pituus}x${details.mitat.leveys}x${details.mitat.korkeus} cm
            - Materiaalit: ${details.materiaalit.join(", ")}
            - Kunto: ${details.kunto}
            
            Anna hinta-arvio huomioiden tuotteen ominaisuudet ja nykyiset markkinahinnat Suomessa.
          `,
        },
      ],
    });

    return result.object;
  }
}

export class PriceAnalysisPipeline {
  private analyzers: PriceAnalyzer[];

  constructor() {
    this.analyzers = [new GPT4PriceAnalyzer(), new GeminiPriceAnalyzer()];
  }

  private calculateAveragePrices(results: PriceAnalysis[]): PriceAnalysis {
    const total = results.length;

    const avgAlin = Math.round(
      results.reduce((sum, result) => sum + result.alin_hinta, 0) / total,
    );

    const avgKorkein = Math.round(
      results.reduce((sum, result) => sum + result.korkein_hinta, 0) / total,
    );

    return {
      alin_hinta: avgAlin,
      korkein_hinta: avgKorkein,
    };
  }
  async analyzePrices(details: FurnitureDetails): Promise<{
    combinedEstimate: PriceAnalysis;
    modelEstimates: Record<string, PriceAnalysis>;
  }> {
    console.log("Aloitetaan hinta-analyysi:");

    const modelEstimates: Record<string, PriceAnalysis> = {};
    const results: PriceAnalysis[] = [];

    // Suorita analyysit rinnakkain
    const analysisPromises = this.analyzers.map(async (analyzer) => {
      try {
        console.log(`Analysoidaan mallilla ${analyzer.name}...`);
        const result = await analyzer.analyze(details);
        modelEstimates[analyzer.name] = result;
        results.push(result);
        console.log(`${analyzer.name} analyysi valmis:`, result);
      } catch (error) {
        console.error(`Virhe ${analyzer.name} analyysissa:`, error);
      }
    });

    await Promise.all(analysisPromises);

    const combinedEstimate = this.calculateAveragePrices(results);
    console.log("Yhdistetty hinta-arvio:", combinedEstimate);

    return {
      combinedEstimate,
      modelEstimates,
    };
  }
}
