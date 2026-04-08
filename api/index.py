import os
import requests
from flask import Flask, redirect, abort, request, send_from_directory

app = Flask(__name__)

# Fallback for local development if env vars aren't set
PROJECT_ID = os.environ.get('FIREBASE_PROJECT_ID', 'hjuyy-c62f7')

@app.route('/')
def index_page():
    frontend_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend')
    return send_from_directory(frontend_dir, 'index.html')

@app.route('/<path:path>')
def catch_all(path):
    """
    Combined handler for static files and short-code redirects.
    """
    frontend_dir = os.path.join(os.path.dirname(__file__), '..', 'frontend')
    
    # 1. Try to serve as a static file
    if os.path.exists(os.path.join(frontend_dir, path)):
        return send_from_directory(frontend_dir, path)
    
    # 2. Handle specific API prefixes that shouldn't be short codes
    if path.startswith('api/') or path in ['generate', 'shorten_url', 'health']:
        return abort(404)

    # 3. Handle as a short code (for /path, /s/path, /velqr/path)
    # Extract actual code if it has a prefix
    short_code = path
    if path.startswith('s/'):
        short_code = path[2:]
    elif path.startswith('velqr/'):
        short_code = path[6:]

    # Query Firestore
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
            if results and 'document' in results[0]:
                fields = results[0]['document'].get('fields', {})
                original_url = fields.get('original_url', {}).get('stringValue')
                if original_url:
                    return redirect(original_url)
        
        # If not found in DB AND not a file, return 404
        return f"Resource or short code '{path}' not found.", 404
    except Exception as e:
        return f"Internal failure: {str(e)}", 500

@app.route('/api/check-availability/<short_code>')
def check_availability(short_code):
    """
    Checks if a short code is already in use.
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
            exists = results and 'document' in results[0]
            return {"available": not exists}
        return {"error": "Failed to check database"}, 500
    except Exception as e:
        return {"error": str(e)}, 500

if __name__ == "__main__":
    app.run(port=5000)
