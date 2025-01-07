import { analyzePrice } from "../services/ai/priceAnalyzer/perplexity";

async function testAnalyzePrice() {
  const testData = {
    merkki: "Martella",
    malli: "Axia 2.50",
    vari: "musta",
    mitat: {
      pituus: 120,
      leveys: 60,
      korkeus: 74,
    },
    materiaalit: ["kangas", "metalli"],
    kunto: "Uusi" as
      | "Hyvä"
      | "Uusi"
      | "Erinomainen"
      | "Kohtalainen"
      | "Huono"
      | "Ei tiedossa",
  };

  try {
    const result = await analyzePrice(testData);
    console.log("Price analysis result:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

(async () => {
  await testAnalyzePrice();
})().catch(console.error);
