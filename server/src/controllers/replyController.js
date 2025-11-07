import Reply from "../models/Reply.js";
import Thread from "../models/Thread.js";

export const createReply = async (req, res) => {
  try {
    const { threadId, content, authorId, parentReplyId } = req.body;

    const reply = new Reply({
      threadId,
      content,
      author: authorId,
      parentReplyId: parentReplyId || null,
    });

    await reply.save();

    // Add reply to thread (only top-level replies)
    if (!parentReplyId) {
      await Thread.findByIdAndUpdate(threadId, { $push: { replies: reply._id } });
    }

    res.status(201).json(reply);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getRepliesByThread = async (req, res) => {
  try {
    const replies = await Reply.find({ threadId: req.params.threadId })
      .populate("author", "username")
      .sort({ createdAt: 1 });

    res.status(200).json(replies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
