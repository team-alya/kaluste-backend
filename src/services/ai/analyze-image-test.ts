// src/services/ai/analyze-images.test.ts
import fs from "fs/promises";
import path from "path";
import { pipeline } from "./furniture-identifier";

async function testAnalyzePipeline() {
  try {
    // Lue testitiedosto
    const imagePath = path.join(__dirname, "../../tests/adde_tuoli.png");
    const imageBuffer = await fs.readFile(imagePath);

    console.log("Starting image analysis...");

    const { result, usedAnalyzers } = await pipeline.analyze(imageBuffer);

    console.log("Analysis complete!");
    console.log("Used analyzers:", usedAnalyzers);
    console.log("Result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testAnalyzePipeline().catch(console.error);
