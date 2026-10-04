import express from "express";
import mongoose from "mongoose";
import BlogPost from "../models/BlogPost.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { destroyImage } from "../utils/cloudinary.js";

const router = express.Router();

const makeExcerpt = (content = "") => {
  const text = content.replace(/\s+/g, " ").trim();
  return text.length > 160 ? text.slice(0, 160) + "…" : text;
};

const validCover = (url) => !url || url.startsWith("https://res.cloudinary.com/");

// Public: প্রকাশিত লেখার তালিকা (কনটেন্ট ছাড়া)
router.get("/", async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 0, 50);
    let query = BlogPost.find({ published: true }).select("-content").sort({ createdAt: -1 });
    if (limit) query = query.limit(limit);
    res.json(await query);
  } catch (err) {
    res.status(500).json({ error: "লেখা আনতে সমস্যা হয়েছে।" });
  }
});

// Admin only: সব লেখা (খসড়াসহ)
router.get("/all", requireAuth, requireAdmin, async (req, res) => {
  try {
    res.json(await BlogPost.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ error: "লেখা আনতে সমস্যা হয়েছে।" });
  }
});

// Public: একটি লেখা
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).json({ error: "লেখাটি পাওয়া যায়নি।" });
    }
    const post = await BlogPost.findOne({ _id: req.params.id, published: true });
    if (!post) return res.status(404).json({ error: "লেখাটি পাওয়া যায়নি।" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "লেখা আনতে সমস্যা হয়েছে।" });
  }
});

// Admin only: নতুন লেখা
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { title, excerpt, content, coverImage, coverPublicId, published } = req.body;
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: "শিরোনাম ও লেখা আবশ্যক।" });
    }
    if (!validCover(coverImage)) return res.status(400).json({ error: "অবৈধ ছবির লিংক।" });

    const post = await BlogPost.create({
      title,
      content,
      excerpt: excerpt?.trim() || makeExcerpt(content),
      coverImage: coverImage || undefined,
      coverPublicId: coverPublicId || undefined,
      published: published !== false,
    });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: "লেখা সংরক্ষণ করতে সমস্যা হয়েছে।" });
  }
});

// Admin only: লেখা সম্পাদনা
router.patch("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const existing = await BlogPost.findById(req.params.id);
    if (!existing) return res.status(404).json({ error: "পাওয়া যায়নি।" });

    const { title, excerpt, content, coverImage, coverPublicId, published } = req.body;
    if (coverImage !== undefined && !validCover(coverImage)) {
      return res.status(400).json({ error: "অবৈধ ছবির লিংক।" });
    }

    const oldCoverId = existing.coverPublicId;
    if (title !== undefined) existing.title = title;
    if (content !== undefined) existing.content = content;
    if (excerpt !== undefined || content !== undefined) {
      existing.excerpt = (excerpt ?? existing.excerpt)?.trim() || makeExcerpt(existing.content);
    }
    if (coverImage !== undefined) {
      existing.coverImage = coverImage || undefined;
      existing.coverPublicId = coverPublicId || undefined;
    }
    if (published !== undefined) existing.published = !!published;

    await existing.save();
    if (coverImage !== undefined && oldCoverId && oldCoverId !== existing.coverPublicId) {
      await destroyImage(oldCoverId);
    }
    res.json(existing);
  } catch (err) {
    res.status(500).json({ error: "আপডেট করতে সমস্যা হয়েছে।" });
  }
});

// Admin only: লেখা মুছে ফেলা
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "পাওয়া যায়নি।" });
    await destroyImage(post.coverPublicId);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "মুছতে সমস্যা হয়েছে।" });
  }
});

export default router;
