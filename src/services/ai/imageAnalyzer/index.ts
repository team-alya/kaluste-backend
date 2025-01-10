import { FurnitureDetails, kuntoOptions } from "@/types/schemas";
import { AIAnalyzer } from "@/types/services";

interface AnalysisResult {
  result: FurnitureDetails;
  confidence: number;
  analyzerName: string;
  completionTime: number;
}

export class ImageAnalysisPipeline {
  private analyzers: AIAnalyzer[];

  constructor(analyzers: AIAnalyzer[]) {
    this.analyzers = analyzers;
  }

  private isValidResult(result: FurnitureDetails): boolean {
    return (
      result.merkki !== "Ei tiedossa" &&
      result.merkki !== "" &&
      result.malli !== "Ei tiedossa" &&
      result.malli !== ""
    );
  }

  private getResultConfidence(result: FurnitureDetails): number {
    let confidence = 0;

    if (result.merkki !== "Ei tiedossa" && result.merkki !== "")
      confidence += 0.4;
    if (result.malli !== "Ei tiedossa" && result.malli !== "")
      confidence += 0.4;
    if (result.vari !== "Ei tiedossa") confidence += 0.05;
    if (result.materiaalit.length > 0) confidence += 0.05;
    if (result.mitat.pituus > 0) confidence += 0.05;
    if (result.kunto !== "Ei tiedossa") confidence += 0.05;

    return confidence;
  }

  /**
   * Käsittelee yksittäisen arvon kentät (merkki, malli, kunto)
   */
  private getKuntoValue(
    results: AnalysisResult[],
  ): (typeof kuntoOptions)[number] {
    return (
      results.map((r) => r.result.kunto).find((k) => k !== "Ei tiedossa") ||
      "Ei tiedossa"
    );
  }

  private getStringValue(
    results: AnalysisResult[],
    fieldName: "merkki" | "malli" | "vari",
  ): string {
    const validResults = results
      .map((r) => r.result[fieldName])
      .filter((value) => value !== "Ei tiedossa" && value !== "");

    if (validResults.length === 0) return "Ei tiedossa";

    const counts = validResults.reduce(
      (acc, value) => {
        acc[value] = (acc[value] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const [mostCommonValue, count] = Object.entries(counts).sort(
      (a, b) => b[1] - a[1],
    )[0];

    return count >= 2 ? mostCommonValue : validResults[0];
  }

  /**
   * Yhdistää pilkulla erotellut arvot (värit)
   */
  private combineColorValues(results: AnalysisResult[]): string {
    const allColors = new Set<string>();

    results.forEach((result) => {
      if (result.result.vari !== "Ei tiedossa" && result.result.vari !== "") {
        // Pilkotaan värit ja käsitellään yhdistelmävärit
        const colors = result.result.vari
          .toLowerCase()
          .split(",")
          .flatMap((color) => {
            // Pilkotaan "ja" tai "sekä" sanalla yhdistetyt värit
            const parts = color.split(/\s+(?:ja|sekä)\s+/);
            return parts.map((p) => p.trim());
          })
          .filter((color) => color !== ""); // Poistetaan tyhjät

        colors.forEach((color) => {
          // Poistetaan duplikaatit normalisoimalla värit
          const normalizedColor = color
            .replace(/\s+/g, " ") // Korvataan moninkertaiset välilyönnit yhdellä
            .trim();
          if (normalizedColor) {
            allColors.add(normalizedColor);
          }
        });
      }
    });

    // Järjestetään värit aakkosjärjestykseen
    const sortedColors = Array.from(allColors).sort();
    return sortedColors.length > 0 ? sortedColors.join(", ") : "Ei tiedossa";
  }

  /**
   * Valitsee parhaat mitat korkeimman luottamusarvon tuloksesta
   */
  private getBestDimensions(results: AnalysisResult[]) {
    const validResults = results
      .filter(
        (r) =>
          r.result.mitat.pituus > 0 &&
          r.result.mitat.leveys > 0 &&
          r.result.mitat.korkeus > 0,
      )
      .sort((a, b) => b.confidence - a.confidence);

    return validResults.length > 0
      ? validResults[0].result.mitat
      : { pituus: 0, leveys: 0, korkeus: 0 };
  }

  /*
   * Käytä GPT-4:n materiaalitietoja, jotta turhaa toistoa ei tule materiaali listaan
   */
  private getMaterialsFromGPT4(results: AnalysisResult[]): string[] {
    // Etsi GPT-4:n tulos
    const gpt4Result = results.find((r) => r.analyzerName === "GPT4Analyzer");

    // Jos GPT-4 löysi materiaaleja, käytä niitä
    if (gpt4Result && gpt4Result.result.materiaalit.length > 0) {
      return gpt4Result.result.materiaalit;
    }

    // Jos GPT-4 ei löytänyt materiaaleja, käytä ensimmäisen analysoijan materiaaleja
    const firstWithMaterials = results.find(
      (r) => r.result.materiaalit.length > 0,
    );
    return firstWithMaterials ? firstWithMaterials.result.materiaalit : [];
  }
  /**
   * Suorittaa analyysin yhdellä mallilla ja palauttaa tuloksen metatietoineen
   */
  private async analyzeWithModel(
    analyzer: AIAnalyzer,
    imageBuffer: Buffer,
  ): Promise<AnalysisResult> {
    try {
      const startTime = Date.now();
      // console.log(`Starting analysis with ${analyzer.name}`);
      const result = await analyzer.analyze(imageBuffer);
      const completionTime = Date.now() - startTime;

      const confidence = this.getResultConfidence(result);
      console.log(
        `${analyzer.name} completed with confidence: ${confidence} in ${completionTime}ms`,
      );

      return {
        result,
        confidence,
        analyzerName: analyzer.name,
        completionTime,
      };
    } catch (error) {
      console.error(`Error with ${analyzer.name}:`, error);
      return {
        result: this.createEmptyResult(),
        confidence: 0,
        analyzerName: analyzer.name,
        completionTime: 0,
      };
    }
  }

  async analyze(imageBuffer: Buffer): Promise<{
    result: FurnitureDetails;
    usedAnalyzers: string[];
  }> {
    // Suorita asynkronisesti analyysit kaikilla analysoijilla
    const analysisPromises = this.analyzers.map((analyzer) =>
      this.analyzeWithModel(analyzer, imageBuffer),
    );

    const results: AnalysisResult[] = [];
    const usedAnalyzers: string[] = [];

    for (const promise of analysisPromises) {
      const result = await promise;
      results.push(result);
      usedAnalyzers.push(result.analyzerName);

      // Jos tämä tulos on validi (merkki ja malli tunnistettu), käytä sitä heti
      if (this.isValidResult(result.result)) {
        console.log(
          `Found valid result from ${result.analyzerName} immediately`,
        );
        return {
          result: result.result,
          usedAnalyzers: [result.analyzerName],
        };
      }
    }

    console.log("\nYhdistetään tulokset mallien konsensuksen perusteella...");

    // Käsittele yksittäiset arvot
    const merkki = this.getStringValue(results, "merkki");
    // Jos merkki löytyi, yritä löytää malli
    const malli =
      merkki !== "Ei tiedossa"
        ? this.getStringValue(results, "malli")
        : "Ei tiedossa";
    const kunto = this.getKuntoValue(results);

    // Yhdistä moniosaiset kentät
    const vari = this.combineColorValues(results);
    const materiaalit = this.getMaterialsFromGPT4(results);
    const mitat = this.getBestDimensions(results);

    // console.log("Tulokset:");
    // console.log(`merkki: "${merkki}"`);
    // console.log(`malli: "${malli}"`);
    // console.log(`vari: "${vari}"`);
    // console.log(`kunto: "${kunto}"`);

    const combinedResult: FurnitureDetails = {
      merkki,
      malli,
      vari,
      mitat,
      materiaalit,
      kunto,
    };

    return {
      result: combinedResult,
      usedAnalyzers,
    };
  }

  private createEmptyResult(): FurnitureDetails {
    return {
      merkki: "Ei tiedossa",
      malli: "Ei tiedossa",
      vari: "Ei tiedossa",
      mitat: {
        pituus: 0,
        leveys: 0,
        korkeus: 0,
      },
      materiaalit: [],
      kunto: "Ei tiedossa",
    };
  }
}
