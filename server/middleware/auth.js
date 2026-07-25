import admin from "../firebaseAdmin.js";

/**
 * Verifies the Firebase ID token sent in the Authorization header
 * as "Bearer <token>". Attaches the decoded token to req.user.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "প্রবেশাধিকার নেই। লগইন করুন।" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "সেশনের মেয়াদ শেষ হয়েছে। আবার লগইন করুন।" });
  }
}

/**
 * Must be used after requireAuth. Restricts access to emails listed
 * in the ADMIN_EMAILS environment variable.
 */
export function requireAdmin(req, res, next) {
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  const userEmail = (req.user?.email || "").toLowerCase();

  if (!adminEmails.includes(userEmail)) {
    return res.status(403).json({ error: "এই তথ্য দেখার অনুমতি আপনার নেই।" });
  }

  next();
}
