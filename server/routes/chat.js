import express from "express";
import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public: start a new chat conversation (called once per visitor, id is then stored client-side)
router.post("/start", async (req, res) => {
  try {
    const { visitorName, visitorEmail } = req.body;
    const conversation = await Conversation.create({
      visitorName: visitorName || "অতিথি",
      visitorEmail,
    });
    res.status(201).json({ conversationId: conversation._id });
  } catch (err) {
    res.status(500).json({ error: "চ্যাট শুরু করতে সমস্যা হয়েছে।" });
  }
});

// Public: fetch message history for a conversation (the visitor's browser keeps the id)
router.get("/:id/messages", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) return res.status(404).json({ error: "কথোপকথন পাওয়া যায়নি।" });
    const messages = await Message.find({ conversation: req.params.id }).sort({ createdAt: 1 });
    res.json({ conversation, messages });
  } catch (err) {
    res.status(500).json({ error: "বার্তা আনতে সমস্যা হয়েছে।" });
  }
});

// Admin only: list all conversations, most recently active first
router.get("/conversations", requireAuth, requireAdmin, async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ lastMessageAt: -1 });
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: "কথোপকথনের তালিকা আনতে সমস্যা হয়েছে।" });
  }
});

// Admin only: close a conversation
router.patch("/conversations/:id/close", requireAuth, requireAdmin, async (req, res) => {
  try {
    const conversation = await Conversation.findByIdAndUpdate(
      req.params.id,
      { status: "closed" },
      { new: true }
    );
    if (!conversation) return res.status(404).json({ error: "পাওয়া যায়নি।" });
    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: "বন্ধ করতে সমস্যা হয়েছে।" });
  }
});

export default router;
