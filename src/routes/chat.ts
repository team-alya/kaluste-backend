/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from "express";
import askQuestion from "../services/OpenAI/chatService";
import { userQueryValidator } from "../utils/middleware";

const router = express.Router();

router.post("/", userQueryValidator, async (req: Request, res: Response) => {
  const { requestId, question } = req.body;

  try {
    const answer = await askQuestion(requestId, question);

    if ("error" in answer) {
      return res.status(500).json(answer);
    }
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
