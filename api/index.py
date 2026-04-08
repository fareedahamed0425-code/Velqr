from flask import Flask, request, jsonify
from flask_cors import CORS
import qrcode
import io
import base64

app = Flask(__name__)
CORS(app)

@app.route('/generate', methods=['POST'])
def generate_qr():
    data = request.json
    url = data.get('url')
    size = data.get('size', 256)
    color = data.get('color', '#000000')
    
    if not url:
        return jsonify({"error": "URL is required"}), 400
        
    try:
        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)

        img = qr.make_image(fill_color=color, back_color="white").convert('RGB')
        img = img.resize((size, size))
        
        img_buffer = io.BytesIO()
        img.save(img_buffer, format="PNG")
        img_buffer.seek(0)
        
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

# No app.run() needed for Vercel
