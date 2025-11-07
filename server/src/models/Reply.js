import mongoose from "mongoose";

const replySchema = new mongoose.Schema({
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Thread",
    required: true,
  },
  parentReplyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reply",
    default: null, // null → top-level reply
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // linking to your existing User model
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model("Reply", replySchema);
