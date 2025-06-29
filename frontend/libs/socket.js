"use client";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BASE_API_URL, {
  withCredentials: true,
  autoConnect: true, // Connect automatically on initialization
  reconnection: true, // Enable reconnection
  reconnectionAttempts: 5, // Number of reconnection attempts
  reconnectionDelay: 1000, // Delay between reconnection attempts
});

// Log connection events for debugging
socket.on("connect", () => {
  console.log("✅ Socket connected with ID:", socket.id);
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error.message);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected, ID:", socket.id);
});

export default socket;
