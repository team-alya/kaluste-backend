import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import dotenv from "dotenv";
import { z } from "zod";
dotenv.config();

// async function geminiText(text: string) {
//   const result = await generateText({
//     model: google("gemini-2.0-flash-exp", {
//       useSearchGrounding: true,
//     }),
//     prompt: text,
//     temperature: 0,
//   });

//   return result.text;
// }
async function geminiObj(text: string) {
  const result = await generateObject({
    model: google("gemini-2.0-flash-exp", {
      useSearchGrounding: true,
    }),
    schema: z.object({
      weather: z.object({
        tempature: z.string(),
        wind: z.array(z.string()),
        date: z.array(z.string()),
      }),
    }),
    prompt: text,
    temperature: 0,
  });

  return result.object;
}

async function testGemini() {
  const testData = `What's the current weather in Helsinki?`;

  try {
    const result = await geminiObj(testData);
    console.log("Result:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

(async () => {
  await testGemini();
})().catch(console.error);
