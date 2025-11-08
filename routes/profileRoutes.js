import express from "express";
import { fetchMe } from "../controllers/profileControllers.js";
const router = express.Router();

router.post("/me", fetchMe);

export default router;
