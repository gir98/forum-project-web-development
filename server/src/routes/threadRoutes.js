import express from "express";
import Thread from "../models/Thread.js";
import Reply from "../models/Reply.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Helper: Build nested replies
const buildNestedReplies = (replies) => {
  const map = {};
  const roots = [];

  replies.forEach((r) => {
    map[r._id] = { ...r._doc, children: [] };
  });

  replies.forEach((r) => {
    if (r.parentReplyId) {
      if (map[r.parentReplyId]) map[r.parentReplyId].children.push(map[r._id]);
    } else {
      roots.push(map[r._id]);
    }
  });

  return roots;
};

// GET all threads
router.get("/", async (req, res) => {
  try {
    const threads = await Thread.find().populate("author", "username");
    res.json(threads);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// GET single thread with nested replies
router.get("/:id", async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id).populate("author", "username");
    if (!thread) return res.status(404).json({ error: "Thread not found" });

    // Fetch replies for this thread
    const replies = await Reply.find({ threadId: thread._id }).populate("author", "username");

    // Build nested structure
    const nestedReplies = buildNestedReplies(replies);

    res.json({ ...thread._doc, replies: nestedReplies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new thread
router.post("/", requireAuth, async (req, res) => {
  const { title, description, tags } = req.body;
  if (!title || !description)
    return res.status(400).json({ error: "Title and description are required" });

  try {
    const newThread = new Thread({
      title,
      description,
      tags: tags || [],
      author: req.user._id,
    });
    await newThread.save();
    const populatedThread = await Thread.findById(newThread._id).populate("author", "username");
    res.status(201).json(populatedThread);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST a new reply (supports nested replies)
router.post("/:id/replies", requireAuth, async (req, res) => {
  const { content, parentReplyId } = req.body;
  if (!content || !content.trim())
    return res.status(400).json({ error: "Reply cannot be empty" });

  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: "Thread not found" });

    const newReply = new Reply({
      threadId: thread._id,
      parentReplyId: parentReplyId || null,
      author: req.user._id,
      content,
    });

    await newReply.save();

    // Fetch all replies again to return updated nested replies
    const replies = await Reply.find({ threadId: thread._id }).populate("author", "username");
    const nestedReplies = buildNestedReplies(replies);

    res.status(201).json({ ...thread._doc, replies: nestedReplies });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
