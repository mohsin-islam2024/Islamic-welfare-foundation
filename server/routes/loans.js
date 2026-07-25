import express from "express";
import LoanApplication from "../models/LoanApplication.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Logged-in users: submit a loan (Qard Hasan) application
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      applicantName,
      fatherOrHusbandName,
      phone,
      address,
      purpose,
      purposeDetails,
      requestedAmount,
      incomeSource,
      monthlyIncome,
      repaymentPlan,
    } = req.body;

    if (!applicantName || !phone || !address || !purpose || !requestedAmount) {
      return res.status(400).json({ error: "প্রয়োজনীয় সকল তথ্য পূরণ করুন।" });
    }

    const application = await LoanApplication.create({
      applicantName,
      fatherOrHusbandName,
      phone,
      address,
      purpose,
      purposeDetails,
      requestedAmount,
      incomeSource,
      monthlyIncome,
      repaymentPlan,
      submittedByUid: req.user.uid,
    });

    res.status(201).json({
      message: "আপনার আবেদন সফলভাবে জমা হয়েছে। ঋণ কমিটি পর্যালোচনা করে যোগাযোগ করবে।",
      application,
    });
  } catch (err) {
    res.status(500).json({ error: "আবেদন জমা দিতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।" });
  }
});

// Logged-in users: see their own applications
router.get("/mine", requireAuth, async (req, res) => {
  try {
    const applications = await LoanApplication.find({ submittedByUid: req.user.uid }).sort({
      createdAt: -1,
    });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "তথ্য আনতে সমস্যা হয়েছে।" });
  }
});

// Admin only: list all applications
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const applications = await LoanApplication.find().sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: "তথ্য আনতে সমস্যা হয়েছে।" });
  }
});

// Admin only: update status / committee notes
router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { status, committeeNotes } = req.body;
    const application = await LoanApplication.findByIdAndUpdate(
      req.params.id,
      { ...(status && { status }), ...(committeeNotes !== undefined && { committeeNotes }) },
      { new: true }
    );
    if (!application) return res.status(404).json({ error: "পাওয়া যায়নি।" });
    res.json(application);
  } catch (err) {
    res.status(500).json({ error: "আপডেট করতে সমস্যা হয়েছে।" });
  }
});

export default router;
