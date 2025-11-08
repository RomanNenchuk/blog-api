import { Post } from "../models/postModel.js";

export const createPost = async (req, res) => {
  try {
    const { title, body, authorId } = req.body;

    if (!title || !body || !authorId)
      return res.status(400).json({ message: "Missing required fields" });

    const post = new Post({ title, body, author: authorId });
    await post.save();

    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author").exec();

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
