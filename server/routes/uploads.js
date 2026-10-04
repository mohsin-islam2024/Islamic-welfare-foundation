import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { isCloudinaryConfigured, signParams } from "../utils/cloudinary.js";

const router = express.Router();

const FOLDERS = { gallery: "al-infaq/gallery", blog: "al-infaq/blog" };

// Admin only: ক্লায়েন্ট সরাসরি Cloudinary-তে আপলোড করার জন্য সই করা প্যারামিটার
router.post("/sign", requireAuth, requireAdmin, (req, res) => {
  if (!isCloudinaryConfigured()) {
    return res.status(500).json({ error: "Cloudinary সেটআপ করা হয়নি (সার্ভারের env ভ্যারিয়েবল দেখুন)।" });
  }
  const folder = FOLDERS[req.body?.folder];
  if (!folder) return res.status(400).json({ error: "অবৈধ ফোল্ডার।" });

  const timestamp = Math.floor(Date.now() / 1000);
  const signature = signParams({ folder, timestamp });

  res.json({
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    folder,
    signature,
  });
});

export default router;
