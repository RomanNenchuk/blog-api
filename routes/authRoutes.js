import express from "express";
import {
  login,
  register,
  logout,
  refresh,
} from "../controllers/authControllers.js";
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", verifyToken, logout);
router.post("/refresh-token", refresh);

export default router;
