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
  review: {
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    comment: String,
  },
});

const Log = mongoose.model("Log", logSchema);
export default Log;
