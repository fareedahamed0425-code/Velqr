import os
import requests
from flask import Flask, redirect, abort, request, send_from_directory

app = Flask(__name__)

# Fallback for local development if env vars aren't set
PROJECT_ID = os.environ.get('FIREBASE_PROJECT_ID', 'hjuyy-c62f7')

@app.route('/velqr/<short_code>')
def redirect_to_url(short_code):
    """
    Redirects a short code to the original URL by querying Firestore via REST API.
    """
    firestore_url = f"https://firestore.googleapis.com/v1/projects/{PROJECT_ID}/databases/(default)/documents:runQuery"
    
    query = {
        "structuredQuery": {
            "from": [{"collectionId": "shortUrls"}],
            "where": {
                "fieldFilter": {
                    "field": {"fieldPath": "short_code"},
                    "op": "EQUAL",
                    "value": {"stringValue": short_code}
                }
            },
            "limit": 1
        }
    }
    
    try:
        response = requests.post(firestore_url, json=query)
        if response.status_code == 200:
            results = response.json()
            # Firestore runQuery returns a list of results. Each result has a 'document' key if found.
            if results and 'document' in results[0]:
                fields = results[0]['document'].get('fields', {})
                original_url = fields.get('original_url', {}).get('stringValue')
                if original_url:
                    return redirect(original_url)
        
        return f"Short code '{short_code}' not found.", 404
    except Exception as e:
        return f"Internal failure: {str(e)}", 500

@app.route('/health')
def health():
    return {"status": "up", "backend": "flask-firebase"}

@app.route('/generate', methods=['POST'])
@app.route('/shorten_url', methods=['POST'])
def deprecated():
    return {"error": "This endpoint is deprecated. Use the frontend Firebase integration."}, 410

# --- Local Development Static Serving ---
# This part handles serving the frontend locally. Vercel usually handles this automatically.
@app.route('/')
def index():
    frontend_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend')
    return send_from_directory(frontend_dir, 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    frontend_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend')
    # If the file exists in frontend, serve it
    if os.path.exists(os.path.join(frontend_dir, path)):
        return send_from_directory(frontend_dir, path)
    # Otherwise, return health for non-matching API routes (or 404)
    return abort(404)

if __name__ == "__main__":
    app.run(port=5000)
