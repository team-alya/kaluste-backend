import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import dotenv from "dotenv";
dotenv.config();

async function geminiText(text: string) {
  const result = await generateText({
    model: google("gemini-2.0-flash-exp", {
      useSearchGrounding: true,
    }),
    prompt: text,
    temperature: 0,
  });

  return result.text;
}

async function testGemini() {
  const testData = `What's the current weather in Helsinki?`;

  try {
    const result = await geminiText(testData);
    console.log("Result:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

(async () => {
  await testGemini();
})().catch(console.error);
