import { AIAnalyzer, AnalyzerResult } from "../../../types/analyzer";

interface AnalysisResult {
  result: AnalyzerResult;
  confidence: number; // Luottamusarvo välillä 0-1
  analyzerName: string;
  completionTime: number;
}

export class AIAnalysisPipeline {
  private analyzers: AIAnalyzer[];

  constructor(analyzers: AIAnalyzer[]) {
    this.analyzers = analyzers;
  }

  /**
   * Tarkistaa onko tulos validi (merkki ja malli tunnistettu)
   */
  private isValidResult(result: AnalyzerResult): boolean {
    return (
      result.merkki !== "Ei tiedossa" &&
      result.merkki !== "" &&
      result.malli !== "Ei tiedossa" &&
      result.malli !== ""
    );
  }

  /**
   * Laskee tuloksen luottamusarvon perustuen tunnistettuihin kenttiin
   * - Merkki ja malli ovat tärkeimmät (0.4 pistettä kummastakin)
   * - Muut kentät antavat lisäpisteitä (0.05 kustakin)
   */
  private getResultConfidence(result: AnalyzerResult): number {
    let confidence = 0;

    if (result.merkki !== "Ei tiedossa" && result.merkki !== "")
      confidence += 0.4;
    if (result.malli !== "Ei tiedossa" && result.malli !== "")
      confidence += 0.4;
    if (result.väri !== "Ei tiedossa") confidence += 0.05;
    if (result.materiaalit.length > 0) confidence += 0.05;
    if (result.mitat.pituus > 0) confidence += 0.05;
    if (result.kunto !== "Ei tiedossa") confidence += 0.05;

    return confidence;
  }

  /**
   * Suorittaa analyysin yhdellä mallilla ja palauttaa tuloksen metatietoineen
   * Käsittelee virhetilanteet palauttamalla tyhjän tuloksen
   */
  private async analyzeWithModel(
    analyzer: AIAnalyzer,
    imageBuffer: Buffer,
  ): Promise<AnalysisResult> {
    try {
      const startTime = Date.now();
      console.log(`Starting analysis with ${analyzer.name}`);
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

  /**
   * Päämetodi joka suorittaa analyysit rinnakkain ja yhdistää tulokset
   * 1. Suorittaa kaikki analyysit rinnakkain
   * 2. Jos löytyy validi tulos, palauttaa sen
   * 3. Muuten yhdistää parhaat osat kaikista tuloksista
   */
  async analyze(imageBuffer: Buffer): Promise<{
    result: AnalyzerResult;
    usedAnalyzers: string[];
  }> {
    // Suorita analyysit rinnakkain
    const analysisPromises = this.analyzers.map((analyzer) =>
      this.analyzeWithModel(analyzer, imageBuffer),
    );

    // Odota kaikkien analyysien valmistumista
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

    // Jos täydellistä tulosta ei löydy, yhdistä parhaat osat eri tuloksista
    console.log("No valid result found, combining best results");
    const sortedResults = results.sort((a, b) => b.confidence - a.confidence);

    const combinedResult = sortedResults.reduce<AnalyzerResult>(
      (combined, current) => ({
        merkki:
          combined.merkki !== "Ei tiedossa" && combined.merkki !== ""
            ? combined.merkki
            : current.result.merkki,
        malli:
          combined.malli !== "Ei tiedossa" && combined.malli !== ""
            ? combined.malli
            : current.result.malli,
        väri:
          combined.väri !== "Ei tiedossa" ? combined.väri : current.result.väri,
        mitat:
          combined.mitat.pituus > 0 ? combined.mitat : current.result.mitat,
        materiaalit:
          combined.materiaalit.length > 0
            ? combined.materiaalit
            : current.result.materiaalit,
        kunto:
          combined.kunto !== "Ei tiedossa"
            ? combined.kunto
            : current.result.kunto,
      }),
      this.createEmptyResult(),
    );

    return {
      result: combinedResult,
      usedAnalyzers,
    };
  }

  private createEmptyResult(): AnalyzerResult {
    return {
      merkki: "Ei tiedossa",
      malli: "Ei tiedossa",
      väri: "Ei tiedossa",
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
