// hooks/useSocket.js
"use client";
import { useEffect } from "react";
import socket from "@/libs/socket"; // your socket instance

export default function useSocket(roadmapId) {
  useEffect(() => {
    console.log("🧠 useSocket called with roadmapId:", roadmapId);
    if (!roadmapId) return;

    // ✅ Always connect early
    if (!socket.connected) {
      console.log("🔌 Connecting socket...");
      console.log("Socket state before connect:", socket.connected);
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("✅ Connected to socket", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected from socket", socket.id);
    });

    socket.emit("join_roadmap", roadmapId);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("new_comment");
    };
  }, [roadmapId]);

  return socket;
}
