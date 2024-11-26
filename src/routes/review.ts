/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from "express";
import { reviewLogger } from "../services/Log/logger";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  const { requestId, review } = req.body;

  try {
    await reviewLogger(requestId, review);
    return res.status(200).json({ message: "Review logged successfully" });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return res
      .status(500)
      .json({ error: `An unexpected error occurred: ${errorMessage}` });
  }
});

export default router;