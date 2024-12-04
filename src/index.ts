import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import imageRouter from "./routes/image";
import priceRouter from "./routes/price";
import chatRouter from "./routes/chat";
import locationRouter from "./routes/location";
import reviewRouter from "./routes/review";
import { MONGODB_URI, OPENAI_API_KEY, PORT, RAHTI_URL, LOCAL_URL } from "./utils/constants";
import mongoose from "mongoose";

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in the environment variables");
}

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not set in the enviromental variables");
}

const app = express();

const corsOptions = {
  origin:
    process.env.NODE_ENV === "dev"
      ? LOCAL_URL
      : process.env.NODE_ENV === "build"
      ? RAHTI_URL
      : undefined,
};

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connection to MongoDB", err);
  });

app.use(cors(corsOptions));
app.use(express.json());

app.get("/ping", (_req: Request, res: Response) => {
  res.send("pong");
});

app.use("/api/image", imageRouter);
app.use("/api/price", priceRouter);
app.use("/api/chat", chatRouter);
app.use("/api/location", locationRouter);
app.use("/api/review", reviewRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
