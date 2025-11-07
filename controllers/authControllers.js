import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import { RefreshToken } from "../models/RefreshToken.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwtGenerators.js";
import { hashPassword, comparePasswords } from "../utils/passwordHashing.js";

dotenv.config();

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email is incorrect" });

    const passwordIsCorrect = await comparePasswords(password, user.password);
    if (!passwordIsCorrect)
      return res.status(400).json({ message: "Password is incorrect" });

    const userInfo = { id: user._id, isAdmin: user.isAdmin };
    const accessToken = generateAccessToken(userInfo);
    const refreshToken = generateRefreshToken(userInfo);

    await RefreshToken.create({ token: refreshToken, userId: user._id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
      },
      token: accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  const { fullname, username, email, password } = req.body;

  if (!fullname || !username || !email || !password || password.length < 6) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const sameUsername = await User.findOne({ username });
    if (sameUsername)
      return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      isAdmin: false,
    });

    const userInfo = { id: newUser._id, isAdmin: newUser.isAdmin };
    const accessToken = generateAccessToken(userInfo);
    const refreshToken = generateRefreshToken(userInfo);

    await RefreshToken.create({ token: refreshToken, userId: newUser._id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      user: {
        id: newUser._id,
        fullname: newUser.fullname,
        username: newUser.username,
        email: newUser.email,
      },
      token: accessToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    const existing = await RefreshToken.findOne({ token: refreshToken });

    if (existing) {
      await RefreshToken.deleteOne({ token: refreshToken });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });
      return res.status(200).json({ message: "Logged out successfully" });
    }

    return res.status(404).json({ message: "Token not found" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(401).json({ message: "Not authenticated" });

  const storedToken = await RefreshToken.findOne({ token: refreshToken });
  if (!storedToken)
    return res.status(403).json({ message: "Refresh token not found" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
    if (error)
      return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken({
      id: user.id,
      isAdmin: user.isAdmin,
    });
    res.status(200).json({ accessToken: newAccessToken });
  });
};
