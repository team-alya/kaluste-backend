// Run with command: npx ts-node make_furniture_dataset.ts
import fs from "fs";
import path from "path";
import {
  analyzeImagePromptFineTuning,
  analyzeImagePromptGPT4o,
} from "../prompts/prompts";
import {
  imgAnalyzeSystemMsg,
  imgAnalyzeSystemMsgFineTuning,
} from "../prompts/system";

// Load labels from JSON file
const labelsPath = path.resolve(__dirname, "../fineTuning/labels.json");
const labelsData = fs.readFileSync(labelsPath, "utf-8");
const labels = JSON.parse(labelsData); // your ground‑truth file

const OUT_PATH = "./furniture_dataset.jsonl";

// Flag to control whether to use full or shortened system message
const USE_SHORT_SYSTEM_MSG = true;

function buildConversation(item: any) {
  // 1) System message - use shorter version for fine-tuning to save tokens
  const systemMsg = USE_SHORT_SYSTEM_MSG
    ? imgAnalyzeSystemMsgFineTuning
    : imgAnalyzeSystemMsg;

  // 2) User message with image_url - käytä optimoitua promptia fine-tuningiin
  const userMsg = [
    {
      type: "text",
      text: USE_SHORT_SYSTEM_MSG
        ? analyzeImagePromptFineTuning
        : analyzeImagePromptGPT4o,
    },
    { type: "image_url", image_url: { url: item.url } },
  ];

  // 3) Assistant message: VAIN merkki ja malli
  const assistantContent = {
    merkki: item.merkki,
    malli: item.malli,
    // Ei muita kenttiä - fokus on vain merkissä ja mallissa
  };

  return {
    messages: [
      { role: "system", content: systemMsg },
      { role: "user", content: userMsg },
      { role: "assistant", content: JSON.stringify(assistantContent) },
    ],
  };
}

function main() {
  const out = fs.createWriteStream(OUT_PATH, { flags: "w" });
  let conversationsWritten = 0;

  // Seurataan eri merkkien ja mallien määrää
  const brandCounts: Record<string, number> = {};
  const modelCounts: Record<string, number> = {};

  // Kerää ensin statistiikkaa
  labels.forEach((item: { url: any; merkki: string; malli: string }) => {
    if (!item.url) return;

    if (item.merkki && item.merkki !== "Ei tiedossa") {
      brandCounts[item.merkki] = (brandCounts[item.merkki] || 0) + 1;
    }

    if (item.malli && item.malli !== "Ei tiedossa") {
      modelCounts[item.malli] = (modelCounts[item.malli] || 0) + 1;
    }
  });

  // Tulosta statistiikkaa
  console.log("Merkkien määrät datassa:");
  Object.entries(brandCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([brand, count]) => {
      console.log(
        `${brand}: ${count} kpl (${((count / labels.length) * 100).toFixed(1)}%)`
      );
    });

  // Suorita varsinainen konversioiden generointi
  for (const item of labels) {
    if (!item.url) {
      console.warn("Skipping entry without URL:", item);
      continue;
    }

    const convo = buildConversation(item);
    out.write(JSON.stringify(convo) + "\n");
    conversationsWritten++;
  }

  out.end();
  console.log(`✅ Wrote ${conversationsWritten} conversations to ${OUT_PATH}`);
  console.log(
    `Using ${USE_SHORT_SYSTEM_MSG ? "shortened" : "full"} system message`
  );
}

main();
