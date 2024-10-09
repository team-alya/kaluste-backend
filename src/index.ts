import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import imageRouter from "./routes/image";
import priceRouter from "./routes/price";
import repairRouter from "./routes/repair";
import { GEMINI_API_KEY } from "./utils/constants";

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY is not set in the environment variables");
}

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/ping", (_req: Request, res: Response) => {
  res.send("pong");
});

app.use("/api/image", imageRouter);
app.use("/api/price", priceRouter);
app.use("/api/repair", repairRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
