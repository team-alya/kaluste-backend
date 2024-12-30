import cors from "cors";
import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import chatRouter from "./routes/chat";
import imageRouter from "./routes/image";
import priceRouter from "./routes/price";
import reviewRouter from "./routes/review";
import { MONGODB_URI, OPENAI_API_KEY, PORT } from "./utils/constants";

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in the environment variables");
}

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set in the enviromental variables");
}

const app = express();

const allowedOrigins = [
  "https://kalustebottifrontend-arvolaskuri-demo.2.rahtiapp.fi",
  "https://arvolaskuri-alyakokeilut.2.rahtiapp.fi",
  "http://localhost:5173",
  "https://localhost:5173",
  "http://localhost:3000",
];

app.use(cors({ origin: allowedOrigins }));

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.use(express.json());

app.get("/ping", (_req: Request, res: Response) => {
  res.send("pong");
});

app.use("/api/image", imageRouter);
app.use("/api/price", priceRouter);
app.use("/api/chat", chatRouter);
// app.use("/api/location", locationRouter);
app.use("/api/review", reviewRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
