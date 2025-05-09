/*
This routes uses Gemini-2.5-flash model from Google to generate responses to user messages.
With useSreachGrounding: true, the model uses google search also to generate responses.
Currently use in the chatbot page.
*/
import { google } from "@ai-sdk/google";
import { smoothStream, streamText } from "ai";
import express, { Request, Response } from "express";
import { getSystemPrompt } from "../services/ai/prompts/system";

const router = express.Router();

const generateResponse = (req: Request, res: Response) => {
  const { messages, furnitureContext } = req.body;
  const abortController = new AbortController();

  const systemPrompt = getSystemPrompt(furnitureContext);

  try {
    const result = streamText({
      model: google("gemini-2.5-flash-preview-04-17", {
        useSearchGrounding: true,
      }),
      messages,
      maxTokens: 1000,
      temperature: 0.5,
      system: systemPrompt,
      abortSignal: abortController.signal,
      experimental_transform: smoothStream({
        delayInMs: 10,
      }),
    });

    result.pipeDataStreamToResponse(res, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("Stream error:", error);
    res.status(500).send("Internal server error");
  }
};

router.post("/", generateResponse);

export default router;
