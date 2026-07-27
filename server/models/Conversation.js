import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    visitorName: { type: String, trim: true, default: "অতিথি" },
    visitorEmail: { type: String, trim: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    lastMessageAt: { type: Date, default: Date.now },
    lastMessagePreview: { type: String, trim: true, maxlength: 200 },
    // Simple unread counters so the admin list and the widget can show badges
    unreadByAdmin: { type: Number, default: 0 },
    unreadByVisitor: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", conversationSchema);
