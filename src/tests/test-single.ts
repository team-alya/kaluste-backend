import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { AIAnalysisPipeline } from "../services/ai/imageAnalyzer";
import { GeminiAnalyzer } from "../services/ai/imageAnalyzer/gemini-2-0-analyzer";
dotenv.config();
async function testSingleImage() {
  const imagePath = path.join(
    __dirname,
    "../tests/images",
    // "akademia.png"
    // "adde_tuoli.png"
    // "marius.png",
    // "seminar-nikari.jpg"
    // "artek-jakkara.jpg"
    // "martella-axia.png"
    // "artek-jakkara.jpg"
    "hay-about.webp",
  );
  const aiModel = new AIAnalysisPipeline([new GeminiAnalyzer()]);
  // new GPT4Analyzer(),
  // new ClaudeAnalyzer(),
  // new GeminiAnalyzer(),
  // new Gemini_1_5_Analyzer(),
  try {
    console.log("\n=== Aloitetaan kuvan analyysi ===");
    console.log(`Testataan kuvaa: ${imagePath}`);

    const imageBuffer = await fs.readFile(imagePath);
    console.log("Kuva luettu onnistuneesti");

    const startTime = Date.now();
    // const result = await finalAnalyze(imageBuffer);
    const { result } = await aiModel.analyze(imageBuffer);
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    console.log("\nAnalyysin tulokset:");
    console.log("-------------------");
    console.log(`Analyysiin kului: ${duration} sekuntia`);
    console.log("Tunnistetut tiedot:");
    console.log(JSON.stringify(result, null, 2));

    const hasValidBrand = result.merkki && result.merkki !== "Ei tiedossa";
    const hasValidModel = result.malli && result.malli !== "Ei tiedossa";

    if (hasValidBrand && hasValidModel) {
      console.log("\n✅ Merkki ja malli tunnistettu onnistuneesti");
    } else {
      console.log("\n⚠️ Puutteellinen tunnistus:");
      if (!hasValidBrand) console.log("- Merkkiä ei tunnistettu");
      if (!hasValidModel) console.log("- Mallia ei tunnistettu");
    }
  } catch (error) {
    console.error("\n❌ Virhe analyysissä:");
    console.error(error);
  }
}

// Suoritetaan testi
testSingleImage().catch((error) => {
  console.error("Test failed:", error);
});
