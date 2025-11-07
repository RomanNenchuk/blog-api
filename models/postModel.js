import mongoose from "mongoose";
const { Schema } = mongoose;

let postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model("Post", postSchema);
export default Post;
