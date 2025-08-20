import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const threadSchema = new mongoose.Schema({
  title: String,
  description: String,
  tags: [String],
  category: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  replies: [replySchema],   // ✅ replies embedded
}, { timestamps: true });

export default mongoose.model("Thread", threadSchema);
