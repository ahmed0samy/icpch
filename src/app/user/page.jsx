"use client";
import { useEffect } from "react";
import Peer from "simple-peer";
import { socket } from "@/lib/socket";

export default function User() {
  useEffect(() => {
    let peer;

    useEffect(() => {
      let stream;

      navigator.mediaDevices.getDisplayMedia({ video: true }).then((s) => {
        stream = s;

        peer = new Peer({
          initiator: true,
          trickle: false,
          stream,
          config: { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] },
        });

        peer.on("signal", (signal) => {
          socket.emit("user-ready", signal);
        });

        socket.on("admin-accepted", (answer) => {
          peer.signal(answer);
        });

        // Listen for resend request
        socket.on("resend-signal", () => {
          if (peer && stream) {
            const newPeer = new Peer({
              initiator: true,
              trickle: false,
              stream,
              config: {
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
              },
            });

            newPeer.on("signal", (signal) => {
              socket.emit("user-ready", signal);
            });

            newPeer.on("error", (err) =>
              console.log("Peer error (resend)", err)
            );
          }
        });
      });

      return () => {
        socket.off("resend-signal");
      };
    }, []);
  }, []);

  return (
    <iframe
      src="https://docs.google.com/forms/d/e/1FAIpQLSeiaPwAxE2uKbYf4b2gDrBaCHel2X-OXAWdXLhTDRgsEkFbOQ/viewform?embedded=true"
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
