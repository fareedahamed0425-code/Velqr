import sys
import os

# Add the root directory to path so we can import api.index
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from api.index import app

if __name__ == '__main__':
    # Run the same way the previous Flask app did
    app.run(host='0.0.0.0', port=5000, debug=True)
