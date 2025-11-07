import express from "express";
import {
  login,
  signup,
  logout,
  refresh,
} from "../controllers/authControllers.js";
import verifyToken from "../middleware/verifyToken.js";
const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", verifyToken, logout);
router.post("/refresh", refresh);

export default router;
