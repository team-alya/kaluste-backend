import { openai } from "@ai-sdk/openai";
import { StreamTextResult, streamText } from "ai";
import express, { Request, Response } from "express";
import { getSystemPrompt } from "../prompts/system";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  const { messages, furnitureContext } = req.body;

  // Create an AbortController
  const abortController = new AbortController();
  const { signal } = abortController;

  const systemPrompt = getSystemPrompt(furnitureContext);

  const result: StreamTextResult<Record<string, never>> = streamText({
    model: openai("gpt-4o"),
    messages,
    maxTokens: 1000,
    temperature: 0.6,
    system: systemPrompt,
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
