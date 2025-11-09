import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/userModel.js";
import { RefreshToken } from "../models/refreshTokenModel.js";
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

    const userInfo = { id: user._id, email: user.email };
    const accessToken = generateAccessToken(userInfo);
    const refreshToken = generateRefreshToken(userInfo);

    await RefreshToken.create({ token: refreshToken, userId: user._id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: process.env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    });

    return res.json(accessToken);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const register = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!fullname || !email || !password || password.length < 6)
    return res.status(400).json({ message: "Invalid credentials" });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    const userInfo = { id: newUser._id, email };
    const accessToken = generateAccessToken(userInfo);
    const refreshToken = generateRefreshToken(userInfo);

    await RefreshToken.create({ token: refreshToken, userId: newUser._id });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: process.env.REFRESH_TOKEN_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
    });

    return res.json(accessToken);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    const existingToken = await RefreshToken.findOne({ token: refreshToken });

    if (!existingToken)
      return res.status(404).json({ message: "Token not found" });

    existingToken.revokedAt = new Date();
    await existingToken.save();
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    return res.status(200).json({ message: "Logged out successfully" });
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
    return res.status(401).json({ message: "Refresh token not found" });

  if (storedToken.isRevoked)
    return res.status(401).json({ message: "Token was revoked" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
    if (error)
      return res.status(401).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken({
      id: user.id,
      email: user.email,
    });
    res.status(200).json(newAccessToken);
  });
};
