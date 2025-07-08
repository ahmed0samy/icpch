"use client";

import { useEffect, useState } from "react";
import Peer from "simple-peer";
import { socket } from "@/lib/socket";

export default function Admin() {
  const [streams, setStreams] = useState([]);
  const [recorders, setRecorders] = useState([]);

  useEffect(() => {
    socket.onAny((event, ...args) => {
      console.log("SOCKET EVENT:", event, args);
    });
    socket.emit("admin-init");

    socket.on("incoming-stream", ({ id, signal }) => {
      console.log("INCOMING STREAM FROM:", id);

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
        console.log("RECEIVED STREAM");

        setStreams((prev) => [...prev, stream]);
        startRecording(stream);
      });

      peer.signal(signal);
    });
  }, []);
  const recordings = []; // global array

  function startRecording(stream) {
    const chunks = [];
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `recording-${Date.now()}.webm`;
      a.click();
    };

    recorder.start();

    // Store it for later stopping
    setRecorders((prev) => [...prev, recorder]);
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, 300px)",
        gap: 10,
      }}
    >
      {streams.map((stream, i) => (
        <video
          key={i}
          autoPlay
          playsInline
          muted
          ref={(el) => el && (el.srcObject = stream)}
        />
      ))}
      <button
        onClick={() => {
          recorders.forEach((r) => r.state === "recording" && r.stop());
          setRecorders([]); // optional: reset after stopping
        }}
        style={{ padding: 10, marginBottom: 20 }}
      >
        Stop All Recordings
      </button>
    </div>
  );
}
