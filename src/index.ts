import express, { Request, Response } from "express";
import imageRouter from "./routes/image";
import priceRouter from "./routes/price";

const app = express();
const PORT = 3000;
app.use(express.json());

app.get("/ping", (_req: Request, res: Response) => {
  res.send("pong");
});

app.use("/api/image", imageRouter);
app.use("/api/price", priceRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
