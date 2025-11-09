import { Post } from "../models/postModel.js";

export const createPost = async (req, res) => {
  try {
    const user = req.user;
    const { title, body } = req.body;

    if (!user?.id) return res.status(403).json({ message: "Access denied" });

    if (!title || !body)
      return res.status(400).json({ message: "Missing required fields" });

    const post = new Post({ title, body, author: user.id });
    await post.save();

    res.status(201).json({ message: "Post created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editPost = async (req, res) => {
  try {
    const user = req.user;
    const { title, body } = req.body;
    const postId = req.params.postId;

    if (!user?.id) return res.status(403).json({ message: "Access denied" });

    if (!title || !body)
      return res.status(400).json({ message: "Missing required fields" });

    const existingPost = await Post.findById(postId);
    if (!existingPost)
      return res.status(404).json({ message: "Post not found" });

    if (existingPost.author.toString() !== user.id)
      return res.status(403).json({ message: "You cannot edit this post" });

    existingPost.title = title;
    existingPost.body = body;

    await existingPost.save();

    res.status(200).json({ message: "Post updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const user = req.user;
    const postId = req.params.postId;

    if (!user?.id) return res.status(403).json({ message: "Access denied" });

    const existingPost = await Post.findById(postId);
    if (!existingPost)
      return res.status(404).json({ message: "Post not found" });

    if (existingPost.author.toString() !== user.id)
      return res.status(403).json({ message: "You cannot delete this post" });

    await existingPost.deleteOne();

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author")
      .sort({ createdAt: -1 })
      .exec();

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate("author").exec();
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
