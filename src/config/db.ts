import mongoose from "mongoose";
import config from "./startup-envs";

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.log("Error connecting to MongoDB", err);
    process.exit(1);
  }
};
