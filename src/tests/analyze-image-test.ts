// src/services/ai/analyze-images.test.ts
import fs from "fs/promises";
import path from "path";
import { pipeline } from "../services/ai/image-analysis-pipeline";

// Lista testattavista kuvista
const TEST_IMAGES = [
  "marius.png",
  // "adde_tuoli.png",
  // "martella-axia.png",
  // "seminar-nikari.jpg",
  // "akademia.png",
  // "artek-jakkara.jpg",
] as const;

async function analyzeImage(imageName: string) {
  console.log("\n================================================");
  console.log(`Testing image: ${imageName}`);
  console.log("================================================\n");

  try {
    const imagePath = path.join(__dirname, "../tests", imageName);
    const imageBuffer = await fs.readFile(imagePath);

    console.log("Starting image analysis...");

    const startTime = Date.now();
    const { result, usedAnalyzers } = await pipeline.analyze(imageBuffer);
    const endTime = Date.now();

    console.log("\nAnalysis Results:");
    console.log("----------------");
    console.log("Used analyzers:", usedAnalyzers);
    console.log("Analysis time:", (endTime - startTime) / 1000, "seconds");
    console.log("\nResult:", JSON.stringify(result, null, 2));

    return { success: true, result };
  } catch (error) {
    console.error(`Error analyzing ${imageName}:`, error);
    return { success: false, error };
  }
}

async function runAllTests() {
  console.log("Starting test suite...\n");

  const results = new Map();

  for (const imageName of TEST_IMAGES) {
    const result = await analyzeImage(imageName);
    results.set(imageName, result);
  }

  // Print summary
  console.log("\n================================================");
  console.log("Test Suite Summary");
  console.log("================================================\n");

  let successCount = 0;
  let failureCount = 0;

  for (const [imageName, result] of results.entries()) {
    if (result.success) {
      successCount++;
      console.log(`✅ ${imageName} - Success`);
      // Tarkista tunnistiko malli sekä merkin että mallin
      const hasValidBrand =
        result.result.merkki !== "Ei tiedossa" && result.result.merkki !== "";
      const hasValidModel =
        result.result.malli !== "Ei tiedossa" && result.result.malli !== "";
      if (hasValidBrand && hasValidModel) {
        console.log(`   Brand: ${result.result.result.merkki}`);
        console.log(`   Model: ${result.result.result.malli}`);
      } else {
        console.log(`   ⚠️ Incomplete recognition (missing brand or model)`);
      }
    } else {
      failureCount++;
      console.log(`❌ ${imageName} - Failed`);
      console.log(`   Error: ${result.error}`);
    }
  }

  console.log("\nFinal Results:");
  console.log(`Total tests: ${TEST_IMAGES.length}`);
  console.log(`Successes: ${successCount}`);
  console.log(`Failures: ${failureCount}`);
  console.log(
    `Success rate: ${((successCount / TEST_IMAGES.length) * 100).toFixed(1)}%`,
  );
}

// Aja testit
runAllTests().catch((error) => {
  console.error("Test suite failed:", error);
  process.exit(1);
});
