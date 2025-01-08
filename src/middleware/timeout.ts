import { NextFunction, Request, Response } from "express";

export const timeout = (req: Request, res: Response, next: NextFunction) => {
  req.setTimeout(180000); // 3min
  res.setTimeout(180000); // 3min
  next();
};
