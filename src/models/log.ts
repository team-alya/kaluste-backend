import mongoose from "mongoose";

const { Schema } = mongoose;

const logSchema = new Schema({
  request_id: { type: String, required: true, unique: true },
  conversation: [
    {
      content: String,
      role: String,
    },
  ],
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Log = mongoose.model("Log", logSchema);
export default Log;
