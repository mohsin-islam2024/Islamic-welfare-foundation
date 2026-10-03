import express from "express";
import Donation from "../models/Donation.js";
import LoanApplication from "../models/LoanApplication.js";
import ContactMessage from "../models/ContactMessage.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Admin only: dashboard summary stats
router.get("/summary", requireAuth, requireAdmin, async (req, res) => {
  try {
    const [totalDonationsAgg, pendingLoans, unreadMessages, donationCount, pendingDonations, loanCount] =
      await Promise.all([
        // শুধু যাচাইকৃত (confirmed) দান যোগ হবে
        Donation.aggregate([
          { $match: { status: "confirmed" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        LoanApplication.countDocuments({ status: { $in: ["জমা হয়েছে", "পর্যালোচনাধীন"] } }),
        ContactMessage.countDocuments({ read: false }),
        Donation.countDocuments(),
        Donation.countDocuments({ status: "pending" }),
        LoanApplication.countDocuments(),
      ]);

    res.json({
      totalDonationAmount: totalDonationsAgg[0]?.total || 0,
      donationCount,
      pendingDonations,
      loanCount,
      pendingLoans,
      unreadMessages,
    });
  } catch (err) {
    res.status(500).json({ error: "সারাংশ আনতে সমস্যা হয়েছে।" });
  }
});

export default router;
