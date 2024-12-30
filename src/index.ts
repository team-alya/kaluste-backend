import cors from "cors";
import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import config from "./config/startup-envs";
import chatRouter from "./routes/chat";
import imageRouter from "./routes/image";
import priceRouter from "./routes/price";
import reviewRouter from "./routes/review";

const app = express();

const allowedOrigins = [
  "https://kalustebottifrontend-arvolaskuri-demo.2.rahtiapp.fi",
  "https://arvolaskuri-alyakokeilut.2.rahtiapp.fi",
  "http://localhost:5173",
  "https://localhost:5173",
  "http://localhost:3000",
  "https://localhost:4173"
];

app.use(cors({ origin: allowedOrigins }));

mongoose
  .connect(config.mongodb.uri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Globaali timeout asetus
app.use((req, res, next) => {
  req.setTimeout(180000); // 3min
  res.setTimeout(180000); // 3min
  next();
});

// Globaali virheenkäsittelijä
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: err.message || "Internal server error",
  });
});

app.get("/ping", (_req: Request, res: Response) => {
  res.send("pong");
});
app.use("/api/image", imageRouter);
app.use("/api/price", priceRouter);
app.use("/api/chat", chatRouter);
// app.use("/api/location", locationRouter);
app.use("/api/review", reviewRouter);

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
