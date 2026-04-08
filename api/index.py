import os
import sys

# Add the backend_django directory to the beginning of the path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend_django')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

from core.wsgi import application

# For Vercel, the object must be named 'app'
app = application
