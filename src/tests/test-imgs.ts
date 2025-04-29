import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { finalAnalyze } from "../services/ai/generate-objects";
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Lista kaikista kuvista, joita halutaan analysoida
const imageList = [
  "lukki-ilmari.jpg",
  "aino-aalto-606.png",
  "ilmari-tapiovaara-pirkka.jpg",
  "adde_tuoli.png",
  "seminar-nikari.jpg",
  "artek-jakkara.jpg",
  "martella-axia.png",
  "hay-about.webp",
  "artek-65.jpg",
  "artek-611.jpg",
  "artek-domus.jpg",
  "akademia.png",
  "marius.png",
  "remmi-yrjo-kukkapuro.jpg",
  "chair.jpg"
];

// Tiedosto, johon tulokset tallennetaan
const resultsFile = path.join(__dirname, "finetuded-gpt-4.1-results.txt");

async function analyzeImage(imageName: string) {
  const imagePath = path.join(__dirname, "images", imageName);
  
  try {
    console.log(`\n=== Aloitetaan kuvan ${imageName} analyysi ===`);
    
    const imageBuffer = await fs.readFile(imagePath);
    console.log("Kuva luettu onnistuneesti");
    
    const startTime = Date.now();
    const result = await finalAnalyze(imageBuffer);
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
    
    // Palautetaan analysoinnin tulos ja kesto
    return { 
      imageName, 
      merkki: result.merkki || "Ei tiedossa", 
      malli: result.malli || "Ei tiedossa",
      duration
    };
    
  } catch (error) {
    console.error(`\n❌ Virhe kuvan ${imageName} analyysissä:`);
    console.error(error);
    
    // Virhetilanteessa palautetaan virheviesti
    return { 
      imageName, 
      merkki: "VIRHE", 
      malli: "VIRHE",
      duration: 0,
    };
  }
}

async function testAllImages() {
  try {
    console.log("Aloitetaan kaikkien kuvien analysointi...");
    
    // Luodaan tai tyhjennetään tulostiedosto
    await fs.writeFile(resultsFile, "Kuva, Merkki, Malli, Kesto (s)\n", "utf-8");
    
    // Käsitellään kuvat yksi kerrallaan
    for (const imageName of imageList) {
      const result = await analyzeImage(imageName);
      
      // Lisätään tulokset tiedostoon
      const resultLine = `${result.imageName}, ${result.merkki}, ${result.malli}, ${result.duration}\n`;
      await fs.appendFile(resultsFile, resultLine, "utf-8");
    }
    
    console.log(`\n✅ Analyysi valmis! Tulokset tallennettu tiedostoon: ${resultsFile}`);
    
  } catch (error) {
    console.error("Analyysi epäonnistui:", error);
  }
}

// Suoritetaan testi kaikille kuville
testAllImages().catch((error) => {
  console.error("Testaus epäonnistui:", error);
});
