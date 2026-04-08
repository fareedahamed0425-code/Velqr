# QR Link Generator - Full Stack Application

A premium, glassmorphic QR code generator built with **Python (Flask)** on the backend and **HTML/CSS/JS** on the frontend. This application allows users to instantly generate high-quality QR codes for any URL and download them as PNG images.

## 🚀 Features

- **Instant QR Generation**: Fast response time using a dedicated Flask API.
- **Glassmorphic UI**: Modern, premium design with translucent effects, gradients, and micro-animations.
- **Customization**: Select between Small, Medium, and Large QR sizes.
- **Download Capability**: Effortlessly download your generated QR code as a high-resolution PNG.
- **Validation**: Built-in URL verification to ensure error-free generation.
- **Clear/Reset**: One-click reset to start over.

## 📁 Project Structure

```text
frontend/
├── index.html    # Main layout & Semantic HTML
├── style.css     # Premium styling & CSS3 Animations
└── script.js    # Frontend logic & API communication
backend/
├── app.py        # Flask server & QR generation logic
└── requirements.txt  # Python dependencies
```

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, CSS3 (Glassmorphism), JavaScript (ES6+).
- **Backend**: Python 3, Flask, `qrcode`, `Pillow`.
- **API**: RESTful POST endpoint for generation.

## ⚙️ Setup & Installation

1. **Install Dependencies**:
   ```bash
   pip install -r backend/requirements.txt
   ```

2. **Run the Application**:
   ```bash
   python backend/app.py
   ```

3. **Access the App**:
   Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your web browser.

---

*Built with ❤️ by Antigravity*
