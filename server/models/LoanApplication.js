import mongoose from "mongoose";

const loanApplicationSchema = new mongoose.Schema(
  {
    applicantName: { type: String, required: true, trim: true },
    fatherOrHusbandName: { type: String, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    purpose: {
      type: String,
      enum: ["ব্যবসা", "শিক্ষা", "চিকিৎসা", "জরুরি পারিবারিক প্রয়োজন", "কৃষিকাজ", "অন্যান্য"],
      required: true,
    },
    purposeDetails: { type: String, trim: true, maxlength: 2000 },
    requestedAmount: { type: Number, required: true, min: 1 },
    incomeSource: { type: String, trim: true },
    monthlyIncome: { type: Number },
    repaymentPlan: { type: String, trim: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["জমা হয়েছে", "পর্যালোচনাধীন", "অনুমোদিত", "প্রত্যাখ্যাত", "পরিশোধিত"],
      default: "জমা হয়েছে",
    },
    committeeNotes: { type: String, trim: true, maxlength: 2000 },
    submittedByUid: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("LoanApplication", loanApplicationSchema);
