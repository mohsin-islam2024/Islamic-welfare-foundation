import express from "express";
import Donation from "../models/Donation.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

const BD_PHONE = /^01[3-9]\d{8}$/;
const TRX_ID = /^[A-Z0-9]{6,20}$/;
const STATUSES = ["pending", "confirmed", "not_received", "cancelled"];

// Public: submit a donation with bKash/Nagad transaction ID
router.post("/", async (req, res) => {
  try {
    const { donorName, phone, email, amount, category, note, paymentMethod, senderNumber } = req.body;
    const trxId = String(req.body.trxId || "").trim().toUpperCase();

    if (!donorName || !phone || !amount) {
      return res.status(400).json({ error: "নাম, ফোন নম্বর ও পরিমাণ আবশ্যক।" });
    }
    if (!(Number(amount) > 0)) {
      return res.status(400).json({ error: "সঠিক পরিমাণ দিন।" });
    }
    if (!["bkash", "nagad"].includes(paymentMethod)) {
      return res.status(400).json({ error: "বিকাশ অথবা নগদ নির্বাচন করুন।" });
    }
    if (!BD_PHONE.test(String(senderNumber || "").trim())) {
      return res.status(400).json({ error: "যে নম্বর থেকে টাকা পাঠিয়েছেন সেটি সঠিকভাবে দিন (১১ সংখ্যা)।" });
    }
    if (!TRX_ID.test(trxId)) {
      return res.status(400).json({ error: "সঠিক TrxID দিন (ইংরেজি অক্ষর ও সংখ্যা, ৬-২০ ঘর)।" });
    }

    const donation = await Donation.create({
      donorName,
      phone,
      email,
      amount,
      category,
      note,
      paymentMethod,
      senderNumber: String(senderNumber).trim(),
      trxId,
      submittedByUid: req.user?.uid,
    });

    res.status(201).json({
      message: "ধন্যবাদ! আপনার দান জমা হয়েছে। TrxID যাচাই শেষে আমরা নিশ্চিত করব।",
      donation,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: "এই TrxID দিয়ে ইতিমধ্যে একটি দান জমা দেওয়া হয়েছে।" });
    }
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

// Admin only: look up a donation by TrxID
router.get("/check/:trxId", requireAuth, requireAdmin, async (req, res) => {
  try {
    const trxId = String(req.params.trxId || "").trim().toUpperCase();
    const donation = await Donation.findOne({ trxId });
    if (!donation) return res.status(404).json({ error: "এই TrxID দিয়ে কোনো দান পাওয়া যায়নি।" });
    res.json(donation);
  } catch (err) {
    res.status(500).json({ error: "যাচাই করতে সমস্যা হয়েছে।" });
  }
});

// Admin only: update donation status
router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: "অবৈধ অবস্থা।" });
    }
    const donation = await Donation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!donation) return res.status(404).json({ error: "পাওয়া যায়নি।" });
    res.json(donation);
  } catch (err) {
    res.status(500).json({ error: "আপডেট করতে সমস্যা হয়েছে।" });
  }
});

export default router;
