flamapp-demo
Flamapp.AI — First Round Assignment (Web Demo + Android JNI Stub)

A lightweight, fast web demo built using React + Vite + OpenCV.js (WASM).
The project demonstrates live webcam processing, image-upload fallback, and a basic Android JNI + C++ native stub for OpenCV integration.

🚀 Overview

This repository contains:

web/ — Fully working React + Vite web application

Grayscale + Canny Edge Detection (OpenCV.js)

Webcam live feed (if available)

Image-upload fallback (works everywhere)

Toggle between raw/processed frames

FPS counter

Snapshot download feature

android/ — A minimal Android project showing:

Kotlin → JNI → C++ flow

Native C++ processing example using OpenCV (stub)

Build notes for NDK + OpenCV Android SDK

docs/ — Demo screenshots for README

🖥️ Web Demo Features

✔ Live webcam frame acquisition
✔ Grayscale + Canny edge detection using OpenCV.js (WASM)
✔ Image-upload fallback (for systems without webcam access)
✔ FPS counter
✔ Switch between raw and processed views
✔ Download processed frame as PNG
✔ Clean UI built with React + Canvas

🧪 How to Run (Web)

Requirements: Node.js 16+ and npm

cd web
npm install
npm run dev
# open http://localhost: xxxx


If webcam is blocked, simply click Upload Image.

🤖 Android JNI Stub (Included)

The android/ folder contains a minimal JNI example:

MainActivity.kt calls a nativeProcessSample() function

native-lib.cpp runs a simple OpenCV C++ operation (Canny on a blank image)

CMakeLists.txt shows how native libs are linked

Intended to demonstrate NDK + JNI familiarity, not a full Android app

To build:

Install Android Studio

Install NDK + CMake

Download OpenCV Android SDK

Update CMakeLists.txt paths

Open android/ folder in Android Studio

Add ndk.dir in local.properties

🏗 Architecture (Summary)
Web
getUserMedia() or file input
         ↓
Offscreen canvas
         ↓
OpenCV.js (WASM): Grayscale → Canny
         ↓
Visible output canvas + controls (toggle, FPS, save)

Android
MainActivity (Kotlin)
     ↓ JNI
native-lib.cpp (C++)
     ↓ OpenCV C++ processing (stub)

📸 Demo Screenshots

Screenshots/GIFs are placed under:

docs/

📌 Notes for Reviewers

Image-upload fallback ensures the demo runs even if webcam is restricted

Android project is kept intentionally minimal but demonstrates correct JNI + native flow

The web demo is production-ready, fast, and fully reproducible

📜 Commit History (Summary)

feat(web): add webcam + image-upload fallback + OpenCV.js processing

feat(android): add JNI stub + native C++ example

docs: add README and demo screenshots
