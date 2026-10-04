import express from "express";
import GalleryItem from "../models/GalleryItem.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { destroyImage } from "../utils/cloudinary.js";

const router = express.Router();

// Public: ছবির তালিকা (নতুন আগে)
router.get("/", async (req, res) => {
  try {
    const items = await GalleryItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "ছবি আনতে সমস্যা হয়েছে।" });
  }
});

// Admin only: আপলোড হয়ে যাওয়া ছবি গ্যালারিতে যোগ করা
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { imageUrl, publicId, caption } = req.body;
    if (!imageUrl || !imageUrl.startsWith("https://res.cloudinary.com/")) {
      return res.status(400).json({ error: "অবৈধ ছবির লিংক।" });
    }
    const item = await GalleryItem.create({ imageUrl, publicId, caption });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: "ছবি সংরক্ষণ করতে সমস্যা হয়েছে।" });
  }
});

// Admin only: ছবি মুছে ফেলা
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const item = await GalleryItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "পাওয়া যায়নি।" });
    await destroyImage(item.publicId);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "মুছতে সমস্যা হয়েছে।" });
  }
});

export default router;
