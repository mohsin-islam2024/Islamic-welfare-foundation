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

    // --- Mobile banking payment info ---
    paymentMethod: { type: String, enum: ["bkash", "nagad"], required: true },
    senderNumber: { type: String, required: true, trim: true }, // যে নম্বর থেকে টাকা পাঠানো হয়েছে
    trxId: { type: String, required: true, trim: true, uppercase: true },

    status: {
      type: String,
      // pending = যাচাই বাকি, confirmed = টাকা পাওয়া গেছে (valid),
      // not_received = টাকা পাওয়া যায়নি (invalid), cancelled = বাতিল
      enum: ["pending", "confirmed", "not_received", "cancelled"],
      default: "pending",
    },
    submittedByUid: { type: String }, // Firebase UID if logged in, optional
  },
  { timestamps: true }
);

// একই TrxID দিয়ে দ্বিতীয়বার জমা দেওয়া ঠেকাতে (পুরনো ডেটায় trxId নেই, তাই partial index)
donationSchema.index(
  { trxId: 1 },
  { unique: true, partialFilterExpression: { trxId: { $type: "string" } } }
);

export default mongoose.model("Donation", donationSchema);
