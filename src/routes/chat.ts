/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from "express";
import askQuestion from "../services/OpenAI/chatService";
import { userQueryValidator } from "../utils/middleware";
import { chatLogger } from "../services/Log/logger";

const router = express.Router();

router.post("/", userQueryValidator, async (req: Request, res: Response) => {
  const { requestId, question } = req.body;

  try {
    await chatLogger(requestId, {
      role: "user",
      content: question
    });
    const answer = await askQuestion(requestId, question);

    if ("error" in answer) {
      return res.status(500).json(answer);
    }

    await chatLogger(requestId, {
      role: "assistant",
      content: answer.answer
    });
    return res.status(200).json(answer);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ error: `An unexpected error occurred: ${errorMessage}` });
  }
});

export default router;
