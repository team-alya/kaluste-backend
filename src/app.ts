import cors from "cors";
import express from "express";
import { corsOptions } from "./config/cors";
import { errorHandler } from "./middleware/errorHandler";
import { timeout } from "./middleware/timeout";
import routes from "./routes";

const createApp = () => {
  const app = express();

  // Middleware
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(timeout);

  app.use("/api", routes);

  app.use(errorHandler);

  return app;
};

export default createApp;
