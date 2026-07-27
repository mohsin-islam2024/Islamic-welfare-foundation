import { io } from "socket.io-client";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// autoConnect: false — components connect explicitly when the chat widget
// (or admin chat tab) actually mounts, instead of on every page load.
export const socket = io(API_BASE, { autoConnect: false });
