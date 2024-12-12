/* eslint-disable @typescript-eslint/no-misused-promises */
import exress, { Response } from "express";
import { locationQueryParser } from "../utils/middleware";
import { LocationQuery } from "../utils/types";
import locationService from "../services/OpenAI/locationService";

const router = exress.Router();

router.post(
  "/",
  locationQueryParser,
  async (req: LocationQuery, res: Response) => {
    try {
      const response = await locationService.analyzeLocation(req.body);
      return res.status(200).json({ result: response });
    } catch (error: unknown) {
      if (error instanceof Error)
        return res.status(500).json({ error: error.message });
    }
    return;
  }
);

export default router;
