"use client";
import { io } from "socket.io-client";

const socket = io(process.env.NEXT_PUBLIC_BASE_API_URL, {
  withCredentials: true,
  autoConnect: true, // Connect automatically on initialization
  reconnection: true, // Enable reconnection
  reconnectionAttempts: 5, // Number of reconnection attempts
  reconnectionDelay: 1000, // Delay between reconnection attempts
});

export default socket;
