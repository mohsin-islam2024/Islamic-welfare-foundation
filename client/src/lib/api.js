import { auth } from "./firebase";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

async function request(path, { method = "GET", body, auth: needsAuth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (needsAuth) {
    const user = auth.currentUser;
    if (!user) throw new Error("লগইন প্রয়োজন।");
    const token = await user.getIdToken();
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "কিছু একটা ভুল হয়েছে।");
  }

  return data;
}

export const api = {
  // Public
  submitDonation: (payload) => request("/api/donations", { method: "POST", body: payload }),
  submitContact: (payload) => request("/api/contact", { method: "POST", body: payload }),
  getActiveNotices: () => request("/api/notices"),

  // Admin only — notices
  getAllNotices: () => request("/api/notices/all", { auth: true }),
  createNotice: (payload) => request("/api/notices", { method: "POST", body: payload, auth: true }),
  updateNotice: (id, payload) =>
    request(`/api/notices/${id}`, { method: "PATCH", body: payload, auth: true }),
  deleteNotice: (id) => request(`/api/notices/${id}`, { method: "DELETE", auth: true }),

  // Gallery & blog (public)
  getGallery: () => request("/api/gallery"),
  getBlogPosts: (limit) => request(`/api/blog${limit ? `?limit=${limit}` : ""}`),
  getBlogPost: (id) => request(`/api/blog/${id}`),

  // Gallery & blog (admin only)
  getUploadSignature: (folder) =>
    request("/api/uploads/sign", { method: "POST", body: { folder }, auth: true }),
  createGalleryItem: (payload) => request("/api/gallery", { method: "POST", body: payload, auth: true }),
  deleteGalleryItem: (id) => request(`/api/gallery/${id}`, { method: "DELETE", auth: true }),
  getAllBlogPosts: () => request("/api/blog/all", { auth: true }),
  createBlogPost: (payload) => request("/api/blog", { method: "POST", body: payload, auth: true }),
  updateBlogPost: (id, payload) =>
    request(`/api/blog/${id}`, { method: "PATCH", body: payload, auth: true }),
  deleteBlogPost: (id) => request(`/api/blog/${id}`, { method: "DELETE", auth: true }),

  // Live chat
  startChat: (payload) => request("/api/chat/start", { method: "POST", body: payload }),
  getChatMessages: (conversationId) => request(`/api/chat/${conversationId}/messages`),
  getConversations: () => request("/api/chat/conversations", { auth: true }),
  closeConversation: (id) => request(`/api/chat/conversations/${id}/close`, { method: "PATCH", auth: true }),

  // Requires login
  submitLoanApplication: (payload) =>
    request("/api/loans", { method: "POST", body: payload, auth: true }),
  getMyLoanApplications: () => request("/api/loans/mine", { auth: true }),

  // Admin only
  getDonations: () => request("/api/donations", { auth: true }),
  checkDonationByTrx: (trxId) =>
    request(`/api/donations/check/${encodeURIComponent(trxId)}`, { auth: true }),
  updateDonationStatus: (id, status) =>
    request(`/api/donations/${id}`, { method: "PATCH", body: { status }, auth: true }),
  getLoanApplications: () => request("/api/loans", { auth: true }),
  updateLoanApplication: (id, payload) =>
    request(`/api/loans/${id}`, { method: "PATCH", body: payload, auth: true }),
  getContactMessages: () => request("/api/contact", { auth: true }),
  markMessageRead: (id) => request(`/api/contact/${id}/read`, { method: "PATCH", auth: true }),
  getAdminSummary: () => request("/api/admin/summary", { auth: true }),
};
