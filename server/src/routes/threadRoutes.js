import express from "express";
import Thread from "../models/Thread.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create thread
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, tags, category } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: "Title and description are required" });
    }

    const thread = new Thread({
      title,
      description,
      tags: tags || [],
      category,
      author: req.user.id,
    });

    await thread.save();
    res.status(201).json(thread);
  } catch (err) {
    console.error("❌ Thread creation error:", err);
    res.status(500).json({ error: "Failed to create thread" });
  }
});

// ✅ Get all threads
router.get("/", async (req, res) => {
  try {
    const threads = await Thread.find()
      .populate("author", "username")
      .populate("replies.author", "username");
    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// ✅ Get single thread
router.get("/:id", async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id)
      .populate("author", "username")
      .populate("replies.author", "username");

    if (!thread) return res.status(404).json({ error: "Thread not found" });
    res.json(thread);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch thread" });
  }
});

// ✅ Add reply
router.post("/:id/replies", authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Reply text is required" });

    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: "Thread not found" });

    thread.replies.push({ text, author: req.user.id });
    await thread.save();

    const updatedThread = await Thread.findById(req.params.id)
      .populate("author", "username")
      .populate("replies.author", "username");

    res.status(201).json(updatedThread);
  } catch (err) {
    console.error("❌ Reply error:", err);
    res.status(500).json({ error: "Failed to add reply" });
  }
});

// ✅ Delete thread
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id);
    if (!thread) return res.status(404).json({ error: "Thread not found" });

    if (thread.author.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await thread.deleteOne();
    res.json({ message: "Thread deleted" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

// ⚠️ TEMP: Delete all threads (cleanup only)
router.delete("/", async (req, res) => {
  try {
    await Thread.deleteMany({});
    res.json({ message: "All threads deleted" });
  } catch (err) {
    console.error("❌ Bulk delete error:", err);
    res.status(500).json({ error: "Failed to delete all threads" });
  }
});
export default router;
