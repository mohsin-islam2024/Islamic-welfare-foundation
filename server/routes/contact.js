import express from "express";
import ContactMessage from "../models/ContactMessage.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !message) {
      return res.status(400).json({ error: "নাম ও বার্তা আবশ্যক।" });
    }
    const contactMessage = await ContactMessage.create({ name, email, phone, subject, message });
    res.status(201).json({ message: "আপনার বার্তা পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।", contactMessage });
  } catch (err) {
    res.status(500).json({ error: "বার্তা পাঠাতে সমস্যা হয়েছে।" });
  }
});

router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "তথ্য আনতে সমস্যা হয়েছে।" });
  }
});

router.patch("/:id/read", requireAuth, requireAdmin, async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!msg) return res.status(404).json({ error: "পাওয়া যায়নি।" });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: "আপডেট করতে সমস্যা হয়েছে।" });
  }
});

export default router;
