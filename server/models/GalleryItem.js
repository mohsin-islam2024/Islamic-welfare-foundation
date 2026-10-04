import mongoose from "mongoose";

const galleryItemSchema = new mongoose.Schema(
  {
    imageUrl: { type: String, required: true, trim: true },
    publicId: { type: String, trim: true },
    caption: { type: String, trim: true, maxlength: 200 },
  },
  { timestamps: true }
);

export default mongoose.model("GalleryItem", galleryItemSchema);
