import express from "express";
import {
  createPost,
  getAllPosts,
  editPost,
  deletePost,
} from "../controllers/postControllers.js";
import verify from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/", getAllPosts);
router.post("/", verify, createPost);
router.put("/:postId", verify, editPost);
router.delete("/:postId", verify, deletePost);

export default router;
