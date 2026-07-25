import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";
import donationRoutes from "./routes/donations.js";
import loanRoutes from "./routes/loans.js";
import contactRoutes from "./routes/contact.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();

// --- Security & basics ---
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

const allowedOrigins = (process.env.CLIENT_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS নীতির কারণে অনুরোধ প্রত্যাখ্যাত হয়েছে।"));
      }
    },
    credentials: true,
  })
);

// Basic rate limiting to protect public POST endpoints from abuse
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 50,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(["/api/donations", "/api/loans", "/api/contact"], publicLimiter);

// --- Routes ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "al-falah-foundation-api" });
});

app.use("/api/donations", donationRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

// --- 404 handler ---
app.use((req, res) => {
  res.status(404).json({ error: "পথটি খুঁজে পাওয়া যায়নি।" });
});

// --- Error handler ---
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "সার্ভারে একটি সমস্যা হয়েছে।" });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Al-Falah Foundation API running on port ${PORT}`);
  });
});
