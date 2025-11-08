import mongoose from "mongoose";
import { mongooseJsonTransform } from "../utils/mongooseTransform.js";

const userSchema = new mongoose.Schema(
  {
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.set("toJSON", mongooseJsonTransform);

export const User = mongoose.model("User", userSchema);
