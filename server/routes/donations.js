import express from "express";
import Donation from "../models/Donation.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Public: submit a donation pledge
router.post("/", async (req, res) => {
  try {
    const { donorName, phone, email, amount, category, note } = req.body;

    if (!donorName || !phone || !amount) {
      return res.status(400).json({ error: "নাম, ফোন নম্বর ও পরিমাণ আবশ্যক।" });
    }
    if (Number(amount) <= 0) {
      return res.status(400).json({ error: "সঠিক পরিমাণ দিন।" });
    }

    const donation = await Donation.create({
      donorName,
      phone,
      email,
      amount,
      category,
      note,
      submittedByUid: req.user?.uid,
    });

    res.status(201).json({ message: "ধন্যবাদ! আপনার দানের অঙ্গীকার গ্রহণ করা হয়েছে।", donation });
  } catch (err) {
    res.status(500).json({ error: "কিছু সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।" });
  }
});

// Admin only: list all donations
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json(donations);
  } catch (err) {
    res.status(500).json({ error: "তথ্য আনতে সমস্যা হয়েছে।" });
  }
});

// Admin only: update donation status
router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!donation) return res.status(404).json({ error: "পাওয়া যায়নি।" });
    res.json(donation);
  } catch (err) {
    res.status(500).json({ error: "আপডেট করতে সমস্যা হয়েছে।" });
  }
});

export default router;
