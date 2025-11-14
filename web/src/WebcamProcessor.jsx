// web/src/WebcamProcessor.jsx
import React, { useRef, useEffect, useState } from "react";

export default function WebcamProcessor() {
  const videoRef = useRef(null);
  const readCanvasRef = useRef(null);
  const outCanvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [fps, setFps] = useState(0);
  const [mode, setMode] = useState("processed"); // raw or processed
  const [usingWebcam, setUsingWebcam] = useState(false);

  useEffect(() => {
    let raf = 0;
    let frames = 0;
    let last = performance.now();

    // helper: process current readCanvas into outCanvas using OpenCV if available
    function processFrameOnce() {
      const inC = readCanvasRef.current;
      const outC = outCanvasRef.current;
      if (!inC || !outC) return;
      if (window.cv && window.cv.onRuntimeInitialized && mode === "processed") {
        try {
          const src = cv.imread(inC);
          const gray = new cv.Mat();
          const edges = new cv.Mat();
          cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
          cv.Canny(gray, edges, 50, 150);
          cv.imshow(outC, edges);
          src.delete(); gray.delete(); edges.delete();
        } catch (e) {
          console.error("OpenCV error:", e);
          outC.getContext("2d").drawImage(inC, 0, 0);
        }
      } else {
        // fallback: just copy the image
        outC.getContext("2d").drawImage(inC, 0, 0);
      }
    }

    async function startWebcamLoop() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        const v = videoRef.current;
        v.srcObject = stream;
        await v.play();
        setUsingWebcam(true);

        // set canvas sizes
        const w = v.videoWidth || 640;
        const h = v.videoHeight || 480;
        readCanvasRef.current.width = w;
        readCanvasRef.current.height = h;
        outCanvasRef.current.width = w;
        outCanvasRef.current.height = h;

        function loop() {
          const rctx = readCanvasRef.current.getContext("2d");
          rctx.drawImage(v, 0, 0, readCanvasRef.current.width, readCanvasRef.current.height);
          processFrameOnce();

          frames++;
          const now = performance.now();
          if (now - last >= 1000) {
            setFps(frames);
            frames = 0;
            last = now;
          }
          raf = requestAnimationFrame(loop);
        }
        raf = requestAnimationFrame(loop);
      } catch (err) {
        console.error("Webcam start failed:", err);
        alert("Webcam could not be started. Use image upload instead.");
        setUsingWebcam(false);
      }
    }

    if (usingWebcam) startWebcamLoop();

    return () => {
      cancelAnimationFrame(raf);
      // stop tracks
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, [usingWebcam, mode]);

  // file upload handler
  function onFileSelected(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      // draw to read canvas at natural size (or scaled to 640x480)
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const w = Math.min(640, iw);
      const h = Math.round((ih * w) / iw);
      readCanvasRef.current.width = w;
      readCanvasRef.current.height = h;
      outCanvasRef.current.width = w;
      outCanvasRef.current.height = h;
      const ctx = readCanvasRef.current.getContext("2d");
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      processStatic();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  // process single static image (upload) using OpenCV if available
  function processStatic() {
    try {
      if (window.cv && window.cv.onRuntimeInitialized && mode === "processed") {
        const inC = readCanvasRef.current;
        const outC = outCanvasRef.current;
        const src = cv.imread(inC);
        const gray = new cv.Mat();
        const edges = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
        cv.Canny(gray, edges, 50, 150);
        cv.imshow(outC, edges);
        src.delete(); gray.delete(); edges.delete();
      } else {
        // fallback: just copy image
        outCanvasRef.current.getContext("2d").drawImage(readCanvasRef.current, 0, 0);
      }
    } catch (e) {
      console.error("Processing error:", e);
      outCanvasRef.current.getContext("2d").drawImage(readCanvasRef.current, 0, 0);
    }
  }

  function downloadSnapshot() {
    const out = outCanvasRef.current;
    if (!out) return;
    const data = out.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = data;
    a.download = "processed_snapshot.png";
    a.click();
  }

  function stopWebcam() {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setUsingWebcam(false);
  }

  return (
    <div style={{ textAlign: "left", color: "#fff", maxWidth: 900 }}>
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setMode((m) => (m === "raw" ? "processed" : "raw"))}>
          Toggle: {mode}
        </button>

        <button
          style={{ marginLeft: 8 }}
          onClick={() => {
            setUsingWebcam(true);
          }}
        >
          Try Webcam
        </button>

        <button style={{ marginLeft: 8 }} onClick={() => { fileInputRef.current.click(); }}>
          Upload Image
        </button>

        <button style={{ marginLeft: 8 }} onClick={downloadSnapshot}>
          Download snapshot
        </button>

        <button style={{ marginLeft: 8 }} onClick={stopWebcam}>
          Stop Webcam
        </button>

        <span style={{ marginLeft: 18 }}>FPS: {fps}</span>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={onFileSelected} style={{ display: "none" }} />
      </div>

      <div style={{ display: "flex", gap: 20 }}>
        <div>
          <video ref={videoRef} style={{ display: usingWebcam ? "block" : "none", width: 320, border: "1px solid #666" }} playsInline muted />
          <div style={{ fontSize: 12, marginTop: 6 }}>{usingWebcam ? "Webcam (visible)" : "Webcam inactive"}</div>
        </div>

        <div>
          {/* hidden read canvas */}
          <canvas ref={readCanvasRef} style={{ display: "none" }} />

          {/* output */}
          <canvas ref={outCanvasRef} style={{ border: "1px solid #ccc", maxWidth: "100%" }} />
        </div>
      </div>

      <div style={{ marginTop: 12, fontSize: 13, color: "#ddd" }}>
        Tips: if OpenCV.js is not loaded yet, processing falls back to showing the raw image. You can upload an image and click "Download snapshot" to create demo screenshots for your README.
      </div>
    </div>
  );
}
