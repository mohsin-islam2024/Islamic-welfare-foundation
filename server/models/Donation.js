import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    amount: { type: Number, required: true, min: 1 },
    category: {
      type: String,
      enum: ["সাধারণ দান", "যাকাত", "সদকা", "কর্জে হাসানাহ তহবিল", "কুরবানির চামড়া", "শিক্ষা সহায়তা", "চিকিৎসা সহায়তা", "দুর্যোগ ত্রাণ"],
      default: "সাধারণ দান",
    },
    note: { type: String, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    submittedByUid: { type: String }, // Firebase UID if logged in, optional
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);
