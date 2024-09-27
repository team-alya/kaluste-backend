import express, { Request, Response } from "express";
import imageRouter from "./routes/image";

const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/ping", (_req: Request, res: Response) => {
  res.send("pong");
});

app.use("/api/image", imageRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
