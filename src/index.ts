import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

app.get("/ping", (_req: Request, res: Response) => {
  res.send("pong");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
