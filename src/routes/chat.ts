import { openai } from "@ai-sdk/openai";
import { smoothStream, streamText } from "ai";
import express, { Request, Response } from "express";
import { getSystemPrompt } from "../services/ai/prompts/system";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  const { messages, furnitureContext } = req.body;

  const abortController = new AbortController();
  const { signal } = abortController;

  const systemPrompt = getSystemPrompt(furnitureContext);

  const result = streamText({
    model: openai("gpt-4o-2024-11-20"),
    messages,
    maxTokens: 1000,
    temperature: 0.6,
    system: systemPrompt,
    abortSignal: signal,
    experimental_transform: smoothStream({
      delayInMs: 10,
    }),
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
