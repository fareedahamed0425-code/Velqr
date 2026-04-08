import os
import sys

# Add the backend_django directory to the path
backend_path = os.path.join(os.path.dirname(__file__), '..', 'backend_django')
if backend_path not in sys.path:
    sys.path.insert(0, backend_path)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

if __name__ == '__main__':
    from django.core.management import execute_from_command_line
    # Run on port 5000 to match the previous Flask setup
    execute_from_command_line([sys.argv[0], 'runserver', '5000'])
