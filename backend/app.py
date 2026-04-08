from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import qrcode
import io
import base64

import os

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)  # Enable CORS for frontend requests

@app.route('/')
def index():
    return send_file('../frontend/index.html')

@app.route('/generate', methods=['POST'])
def generate_qr():
    data = request.json
    url = data.get('url')
    size = data.get('size', 256)
    color = data.get('color', '#000000')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400
        
    try:
        # Generate QR Code
        qr = qrcode.QRCode(
            version=None, # auto
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)

        # Create an image from the QR Code instance
        # qrcode lib uses fill_color and back_color
        img = qr.make_image(fill_color=color, back_color="white").convert('RGB')
        
        # Resize to requested size
        img = img.resize((size, size))
        
        # Save image to a bytes buffer
        img_buffer = io.BytesIO()
        img.save(img_buffer, format="PNG")
        img_buffer.seek(0)
        
        # Convert to base64 to send as JSON or just send the file
        # To make it easier for the frontend to display, I'll return base64
        img_str = base64.b64encode(img_buffer.getvalue()).decode('utf-8')
        
        return jsonify({
            "status": "success",
            "qr_code": f"data:image/png;base64,{img_str}"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "up"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
