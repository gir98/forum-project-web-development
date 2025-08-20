// server/src/routes/auth.routes.js
import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

/**
 * REGISTER
 */
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    // no manual hashing here, User model pre-save middleware will handle it
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    console.error("❌ Register error:", err.message);
    res.status(400).json({ error: "Registration failed" });
  }
});

/**
 * LOGIN
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("🔑 Login attempt:", email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // create JWT
    const token = jwt.sign(
      { id: user._id, tokenVersion: user.tokenVersion },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log("✅ Login success:", email);
    res.json({ token });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: "Login failed" });
  }
});

/**
 * GET CURRENT USER
 */
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

/**
 * LOGOUT (client just removes token)
 */
router.post("/logout", authMiddleware, (req, res) => {
  res.json({ message: "Logout successful, clear token on client" });
});

/**
 * INVALIDATE ALL TOKENS
 */
router.post("/invalidate-tokens", async (req, res) => {
  try {
    await User.updateMany({}, { $inc: { tokenVersion: 1 } });
    res.json({ message: "All tokens invalidated. Users must login again." });
  } catch (err) {
    console.error("❌ Invalidate error:", err.message);
    res.status(500).json({ error: "Failed to invalidate tokens" });
  }
});

export default router;
