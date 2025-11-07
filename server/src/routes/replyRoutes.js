import express from "express";
import { createReply, getRepliesByThread } from "../controllers/replyController.js";

const router = express.Router();

router.post("/", createReply);
router.get("/:threadId", getRepliesByThread);

export default router;
