import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, trim: true, maxlength: 2000 },
    active: { type: Boolean, default: true },
    // Notices can auto-expire; if not set, stays active until manually turned off
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Notice", noticeSchema);
