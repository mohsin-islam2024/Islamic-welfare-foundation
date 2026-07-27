import { Server } from "socket.io";
import admin from "./firebaseAdmin.js";
import Conversation from "./models/Conversation.js";
import Message from "./models/Message.js";

const ADMIN_ROOM = "admin_room";

function getAdminEmails() {
  return (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function initSocket(httpServer, allowedOrigins) {
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // --- Visitor side ---
    socket.on("join_conversation", (conversationId) => {
      if (conversationId) socket.join(`conv_${conversationId}`);
    });

    socket.on("visitor_message", async ({ conversationId, text, visitorName }) => {
      if (!conversationId || !text?.trim()) return;
      try {
        const message = await Message.create({
          conversation: conversationId,
          sender: "visitor",
          senderName: visitorName || "অতিথি",
          text: text.trim(),
        });

        const conversation = await Conversation.findByIdAndUpdate(
          conversationId,
          {
            lastMessageAt: new Date(),
            lastMessagePreview: text.trim().slice(0, 200),
            $inc: { unreadByAdmin: 1 },
            status: "open",
          },
          { new: true }
        );

        io.to(`conv_${conversationId}`).emit("new_message", message);
        io.to(ADMIN_ROOM).emit("conversation_updated", conversation);
      } catch (err) {
        console.error("visitor_message error:", err.message);
      }
    });

    // --- Admin side ---
    // Admin authenticates the socket by sending their Firebase ID token.
    socket.on("admin_join", async (idToken) => {
      try {
        const decoded = await admin.auth().verifyIdToken(idToken);
        const email = (decoded.email || "").toLowerCase();
        if (!getAdminEmails().includes(email)) return;
        socket.data.isAdmin = true;
        socket.data.adminEmail = email;
        socket.join(ADMIN_ROOM);
      } catch {
        // Invalid token — silently ignore, socket just won't get admin privileges
      }
    });

    socket.on("admin_join_conversation", (conversationId) => {
      if (!socket.data.isAdmin || !conversationId) return;
      socket.join(`conv_${conversationId}`);
    });

    socket.on("admin_message", async ({ conversationId, text }) => {
      if (!socket.data.isAdmin || !conversationId || !text?.trim()) return;
      try {
        const message = await Message.create({
          conversation: conversationId,
          sender: "admin",
          senderName: "ফাউন্ডেশন টিম",
          text: text.trim(),
        });

        const conversation = await Conversation.findByIdAndUpdate(
          conversationId,
          {
            lastMessageAt: new Date(),
            lastMessagePreview: text.trim().slice(0, 200),
            unreadByAdmin: 0,
            $inc: { unreadByVisitor: 1 },
          },
          { new: true }
        );

        io.to(`conv_${conversationId}`).emit("new_message", message);
        io.to(ADMIN_ROOM).emit("conversation_updated", conversation);
      } catch (err) {
        console.error("admin_message error:", err.message);
      }
    });
  });

  return io;
}
