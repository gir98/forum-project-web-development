import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body || {};
  if (!username || !email || !password) return res.status(400).json({ error: "Missing fields" });

  try {
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(409).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });
    return res.status(201).json({ id: user.id, username: user.username, email: user.email });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body || {};
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email avatarUrl createdAt");
    return res.json(user);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
};
