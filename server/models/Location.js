import { Schema, model } from "mongoose";

const locationSchema = new Schema({
  userId: { type: String, required: true, index: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default model("Location", locationSchema);
