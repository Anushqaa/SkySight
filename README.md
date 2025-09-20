# SkySight: Semantic Segmentation of Aerial Drone Imagery

**From pixels to meaning: teaching AI to understand landscapes**

---

## Overview

SkySight is an end-to-end **semantic segmentation pipeline** that transforms high-resolution drone images into detailed landscape maps.

The system recognizes roads, rivers, trees, buildings, and more — pixel by pixel. Built with deep learning, computer vision, and modern full-stack engineering, it demonstrates how advanced AI models can move from research to real-world, interactive applications.

---

## 🎥 Demo

![demo](https://github.com/Anushqaa/SkySight/blob/main/screenshots/skysight.gif) 



---

## 🖼️ UI Preview

<p align="center">
  <img src="https://raw.githubusercontent.com/Anushqaa/SkySight/refs/heads/main/screenshots/Landing.png" alt="Landing" width="70%"/>
  <img src="https://raw.githubusercontent.com/Anushqaa/SkySight/refs/heads/main/screenshots/Slide1.png" alt="Slide 1" width="70%"/>
  <img src="https://raw.githubusercontent.com/Anushqaa/SkySight/refs/heads/main/screenshots/Slide2.png" alt="Slide 2" width="70%"/>
  <img src="https://raw.githubusercontent.com/Anushqaa/SkySight/refs/heads/main/screenshots/Slide3.png" alt="Slide 3" width="70%"/>
</p>

---

## ✨ Key Features

* **Custom Data Pipeline** – preprocessing, augmentation, and class balance handling for a small dataset (400 images).
* **Model Exploration** – trained and compared seven segmentation architectures:
  UNet, UNet+ResNet34, UNet+VGG16, UNet+MobileNetV2, UNet++, LinkNet, DeepLabV3+.
* **Optimized Training** – custom Dice Loss + Mean IoU metric; early stopping after 63 epochs.
* **Final Model** – DeepLabV3+, achieving **0.508 IoU** and **0.166 loss** on test set.
* **FastAPI Backend** – async inference service returning segmentation masks and color legends.
* **React Frontend** – clean UI to upload drone images, visualize predictions, and explore features.
* **Deployment** – hosted API on Render, integrated seamlessly with frontend.

---

## 🛠 Tech Stack

<p align="center">
  <img src="https://skillicons.dev/icons?i=python,pytorch,fastapi,react,tailwind,opencv,npm" />
</p>

* **Machine Learning & Data** – Python, PyTorch, OpenCV, Albumentations
* **Backend** – FastAPI, Uvicorn, Render deployment
* **Frontend** – React, TailwindCSS, NPM

---

## 🚀 Getting Started

### Backend (FastAPI)

```bash
cd api
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 📊 Results

* **Final Model:** DeepLabV3+ with ASPP
* **Performance:** 0.508 Mean IoU | 0.166 Dice Loss
* **Strengths:** handles class imbalance, captures fine details, scales efficiently
* **Output:** segmented masks overlayed on drone images with legend

---

## 📜 License

This project is licensed under the [Apache 2.0 License](./LICENSE).

---

## 📩 Contact

**Developer:** Advanced Full-Stack Machine Learning & AI Engineer

* 📧 Email: [anushqa.shekhawat@gmail.com](mailto:anushqa.shekhawat@gmail.com)
* 🌐 Portfolio: [imaqui.streamlit.app](https://imaqui.streamlit.app)
