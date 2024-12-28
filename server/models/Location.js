import { Schema, model } from "mongoose";

const locationSchema = new Schema({
  userId: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timesStamd: { type: Date, default: Date.now },
});

export default model("Location", locationSchema);
