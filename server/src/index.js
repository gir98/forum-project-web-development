import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import threadRoutes from "./routes/threadRoutes.js";
import replyRoutes from "./routes/replyRoutes.js";

dotenv.config();

const app = express();

// ====== MIDDLEWARES ======
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// ====== HEALTH CHECK ======
app.get("/api/health", (req, res) => res.json({ ok: true }));

// ====== ROUTES ======
app.use("/api/auth", authRoutes);
app.use("/api/threads", threadRoutes);
app.use("/api/replies", replyRoutes);

// ====== DATABASE CONNECTION ======
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running → http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });
