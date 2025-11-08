import mongoose from "mongoose";
const { Schema } = mongoose;

let postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Post = mongoose.model("Post", postSchema);
