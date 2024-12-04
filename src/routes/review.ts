/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { Request, Response } from "express";
import { reviewLogger } from "../services/Log/logger";
import { reviewValidator } from "../utils/middleware";

const router = express.Router();

router.post("/", reviewValidator, async (req: Request, res: Response) => {
  const { requestId, review } = req.body;

  try {
    const result = await reviewLogger(requestId, review);
    if ("error" in result) {
      return res.status(result.status).json({ error: result.error });
    }
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