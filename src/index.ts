import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import imageRouter from "./routes/image";
import priceRouter from "./routes/price";
import chatRouter from "./routes/chat";
import locationRouter from "./routes/location";
import { OPENAI_API_KEY } from "./utils/constants";

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in the environment variables");
}

const app = express();
const PORT = 3000;

const corsOptions = {
  origin: "https://kalustebottifrontend-arvolaskuri-demo.2.rahtiapp.fi",
};

app.use(cors(corsOptions));
app.use(express.json());

app.get("/ping", (_req: Request, res: Response) => {
  res.send("pong");
});

app.use("/api/image", imageRouter);
app.use("/api/price", priceRouter);
app.use("/api/chat", chatRouter);
app.use("/api/location", locationRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
