import express, { Response } from "express";
import { reviewQueryParser } from "../middleware/middleware";
import { reviewLogger } from "../services/log/logger";
import { ReviewQuery } from "../types/middleware";

const router = express.Router();

router.post("/", reviewQueryParser, async (req: ReviewQuery, res: Response) => {
  const { requestId, review } = req.body;
  console.log("sendFeedBack", requestId, review);

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
