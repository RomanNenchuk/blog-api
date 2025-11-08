import mongoose from "mongoose";
import { mongooseJsonTransform } from "../utils/mongooseTransform.js";
const { Schema } = mongoose;

let postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

postSchema.set("toJSON", mongooseJsonTransform);

export const Post = mongoose.model("Post", postSchema);
