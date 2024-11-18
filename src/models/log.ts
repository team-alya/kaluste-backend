import mongoose from "mongoose";

const { Schema } = mongoose;

const logSchema = new Schema({
  conversation: [
    {
      content: String,
      role: String,
    },
  ],
});

const Log = mongoose.model("Log", logSchema);
export default Log;
