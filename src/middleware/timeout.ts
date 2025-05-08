import { NextFunction, Request, Response } from "express";
export const timeout = (req: Request, res: Response, next: NextFunction) => {
  const sevenMinutesInMs = 7 * 60 * 1000; // 7min (420000ms)
  req.setTimeout(sevenMinutesInMs);
  res.setTimeout(sevenMinutesInMs);
  next();
};
