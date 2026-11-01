import express from "express";
import GalleryItem from "../models/GalleryItem.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { destroyImage } from "../utils/cloudinary.js";

const router = express.Router();

// Public: ছবির তালিকা (নতুন আগে)
//  - ?page=1&limit=24 দিলে পাতা ভাগ করে { items, total, page, pages } ফেরত দেয়
//  - কিছু না দিলে আগের মতো সব ছবির অ্যারে (অ্যাডমিন প্যানেল এটাই ব্যবহার করে)
router.get("/", async (req, res) => {
  try {
    const paginated = req.query.page !== undefined || req.query.limit !== undefined;
    if (!paginated) {
      return res.json(await GalleryItem.find().sort({ createdAt: -1 }));
    }

    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 24, 1), 60);
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const [items, total] = await Promise.all([
      GalleryItem.find()
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      GalleryItem.countDocuments(),
    ]);
    res.json({ items, total, page, pages: Math.ceil(total / limit) });
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
