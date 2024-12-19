import { openai } from "@ai-sdk/openai";
import { StreamTextResult, streamText } from "ai";
import express, { Request, Response } from "express";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  const { messages } = req.body;

  // Create an AbortController
  const abortController = new AbortController();
  const { signal } = abortController;

  const result: StreamTextResult<Record<string, never>> = streamText({
    model: openai("gpt-4-turbo"),
    messages,
    maxTokens: 1000,
    temperature: 0.7,
    system:
      "Olet avulias assistentti joka neuvoo käytettyn kalusteen myymisessä, lahjoittamisessa, kierrättämisessä ja kunnostamisessa.",
    abortSignal: signal,
  });

  try {
    result.pipeDataStreamToResponse(res, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    if (signal.aborted) {
      console.log("Stream aborted by client");
      abortController.abort();
    } else {
      console.error("Unexpected stream error:", error);
    }
  }
});

export default router;
