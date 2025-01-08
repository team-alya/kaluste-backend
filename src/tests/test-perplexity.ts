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

  console.log("Aloitetaan hinnan analysointi...");
  const startTime = performance.now();

  try {
    const result = await analyzePrice(testData);
    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000; // sekunneiksi

    console.log("Hinnan analysointi valmis!");
    console.log(`Analysointiin kului aikaa: ${duration.toFixed(2)} sekuntia`);
    console.log("Analyysin tulos:", result);
  } catch (error) {
    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000;

    console.error("Virhe analysoinnissa!");
    console.error(
      `Analysointi keskeytyi ${duration.toFixed(2)} sekunnin jälkeen`,
    );
    console.error("Virheen tiedot:", error);
  }
}

(async () => {
  await testAnalyzePrice();
})().catch((error) => {
  console.error("Kriittinen virhe sovelluksen suorituksessa:", error);
});
