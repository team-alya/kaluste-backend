import dotenv from "dotenv";
import { AIAnalyzer, AnalyzerResult } from "../../../types/analyzer";

dotenv.config();

export class GPT4Analyzer implements AIAnalyzer {
  name = "GPT-4";
  // async analyze(imageBuffer: Buffer): Promise<AnalyzerResult> {
  //   try {
  //     const result = await generateObject({
  //       model: openai("gpt-4o"),
  //       schema: furnitureDetailsSchema,
  //       output: "object",
  //       system: imgAnalyzeSystemMsg,
  //       messages: [
  //         {
  //           role: "user",
  //           content: [
  //             {
  //               type: "text",
  //               text: "Analysoi tämä suomalainen huonekalu ja tunnista sen tiedot. Mikäli et pysty tunnistamaan kenttää palauta 'Ei tiedossa'.",
  //             },
  //             {
  //               type: "image",
  //               image: imageBuffer,
  //             },
  //           ],
  //         },
  //       ],
  //     });
  //     console.log("result.object", result.object);

  //     return result.object;
  //   } catch (error) {
  //     console.error("Error analyzing image:", error);
  //     throw error;
  //   }
  // }

  analyze(_imageBuffer: Buffer): Promise<AnalyzerResult> {
    return Promise.resolve({
      merkki: "Akademia",
      malli: "",
      väri: "",
      mitat: {
        pituus: 4,
        leveys: 4,
        korkeus: 4,
      },
      materiaalit: ["puu"],
      kunto: "Uusi",
    });
  }
}
