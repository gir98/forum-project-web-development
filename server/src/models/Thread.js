import mongoose from "mongoose";

// Reply schema (subdocument)
const replySchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  children: [{ type: mongoose.Schema.Types.Mixed }], // allows nested replies
  createdAt: { type: Date, default: Date.now }
});

// Thread schema
const threadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  tags: [String],
  replies: [replySchema], // top-level replies
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Thread", threadSchema);
