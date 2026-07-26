import express from "express";
import Notice from "../models/Notice.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public: get all currently active, non-expired notices (newest first)
router.get("/", async (req, res) => {
  try {
    const notices = await Notice.find({
      active: true,
      $or: [{ expiresAt: { $exists: false } }, { expiresAt: null }, { expiresAt: { $gt: new Date() } }],
    }).sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: "নোটিশ আনতে সমস্যা হয়েছে।" });
  }
});

// Admin only: get every notice (active + inactive) for management
router.get("/all", requireAuth, requireAdmin, async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ error: "নোটিশ আনতে সমস্যা হয়েছে।" });
  }
});

// Admin only: create a notice
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, body, expiresAt } = req.body;
    if (!title) return res.status(400).json({ error: "শিরোনাম আবশ্যক।" });

    const notice = await Notice.create({
      title,
      body,
      expiresAt: expiresAt || undefined,
    });
    res.status(201).json(notice);
  } catch (err) {
    res.status(500).json({ error: "নোটিশ তৈরি করতে সমস্যা হয়েছে।" });
  }
});

// Admin only: update a notice (edit text, toggle active, change expiry)
router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, body, active, expiresAt } = req.body;
    const notice = await Notice.findByIdAndUpdate(
      req.params.id,
      {
        ...(title !== undefined && { title }),
        ...(body !== undefined && { body }),
        ...(active !== undefined && { active }),
        ...(expiresAt !== undefined && { expiresAt: expiresAt || null }),
      },
      { new: true }
    );
    if (!notice) return res.status(404).json({ error: "পাওয়া যায়নি।" });
    res.json(notice);
  } catch (err) {
    res.status(500).json({ error: "আপডেট করতে সমস্যা হয়েছে।" });
  }
});

// Admin only: delete a notice
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) return res.status(404).json({ error: "পাওয়া যায়নি।" });
    res.json({ message: "নোটিশ মুছে ফেলা হয়েছে।" });
  } catch (err) {
    res.status(500).json({ error: "মুছতে সমস্যা হয়েছে।" });
  }
});

export default router;
