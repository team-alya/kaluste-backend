import { analyzePrice } from "./perplexity";

async function testAnalyzePrice() {
  const testData = {
    merkki: "Isku",
    malli: "Pro",
    vari: "musta",
    mitat: {
      pituus: 120,
      leveys: 60,
      korkeus: 74,
    },
    materiaalit: ["metalli", "puu"],
    kunto: "hyvä" as
      | "hyvä"
      | "uusi"
      | "erinomainen"
      | "kohtalainen"
      | "huono"
      | "ei tiedossa",
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
