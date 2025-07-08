"use client";

import { useEffect, useState } from "react";
import Peer from "simple-peer";
import { socket } from "@/lib/socket";

export default function Admin() {
  const [streams, setStreams] = useState([]);
  const [peers, setPeers] = useState({});

  useEffect(() => {
    socket.emit("admin-init");

    socket.on("incoming-stream", ({ id, signal }) => {
      if (peers[id]) {
        console.log("Peer already exists for", id);
        return;
      }

      const peer = new Peer({
        initiator: false,
        trickle: false,
        config: {
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        },
      });

      peer.on("signal", (answer) => {
        socket.emit("admin-answer", { id, signal: answer });
      });

      peer.on("stream", (stream) => {
        console.log("RECEIVED STREAM FROM", id);
        setStreams((prev) => [...prev, { id, stream }]);
      });

      peer.on("error", (err) => {
        console.log("Peer error", err);
      });

      peer.on("close", () => {
        console.log("Peer closed", id);
        setStreams((prev) => prev.filter((s) => s.id !== id));
        setPeers((prev) => {
          const copy = { ...prev };
          delete copy[id];
          return copy;
        });
      });

      setPeers((prev) => ({ ...prev, [id]: peer }));
      peer.signal(signal);
    });

    return () => {
      socket.off("incoming-stream");
    };
  }, []);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 300px)",
        gap: 10,
      }}
    >
      {streams.map(({ id, stream }) => (
        <video
          key={id}
          autoPlay
          playsInline
          muted
          ref={(el) => el && (el.srcObject = stream)}
        />
      ))}
    </div>
  );
}
