# flamapp-demo

**Flamapp.AI — First Round Assignment (Web demo + Android stub)**

## Overview
A fast web demo built with **React + Vite + OpenCV.js** that demonstrates frame acquisition and frame processing (Grayscale → Canny edge detection).  
This repository contains:

- `web/` — React + Vite web demo using OpenCV.js (WASM).
- `android/` — Minimal Android JNI stub showing native C++ processing flow.
- `docs/` — Demo screenshots / GIFs.

---

## Features implemented (Web)
- Image acquisition from:
  - Webcam (if supported),
  - **Image Upload (fallback)** – works on all systems and ensures reproducible results.
- Image processing using **OpenCV.js** (WASM):
  - RGBA → Grayscale  
  - Canny Edge Detection
- Toggle between **raw** and **processed** frames.
- FPS counter for webcam mode.
- **Download Snapshot** button for saving processed output.
- Clean, simple UI built using React + Canvas.

---

## How to run (Web)

Requirements: Node.js 16+ and npm.

```bash
cd web
npm install
npm run dev
# open http://localhost:5173
