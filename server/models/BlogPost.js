import mongoose from "mongoose";

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    excerpt: { type: String, trim: true, maxlength: 300 },
    content: { type: String, required: true, trim: true, maxlength: 20000 },
    coverImage: { type: String, trim: true },
    coverPublicId: { type: String, trim: true },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("BlogPost", blogPostSchema);
