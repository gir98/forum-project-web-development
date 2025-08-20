import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import threadRoutes from "./routes/threadRoutes.js";

dotenv.config();

const app = express();

// middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// health route
app.get("/api/health", (req, res) => res.json({ ok: true }));

// routes
app.use("/api/auth", authRoutes);
app.use("/api/threads", threadRoutes);   // ✅ mount after middlewares

// db connect
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");
  app.listen(process.env.PORT, () =>
    console.log(`API → http://localhost:${process.env.PORT}`)
  );
}).catch(err => {
  console.error("DB error", err);
  process.exit(1);
});
