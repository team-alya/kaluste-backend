import "dotenv/config";
import createApp from "./app";
import { connectDB } from "./config/db";
import config from "./config/startup-envs";

const startServer = async () => {
  await connectDB();

  const app = createApp();

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
};

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
