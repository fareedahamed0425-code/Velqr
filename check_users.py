import os
import django
import sys

# Add the backend_django directory to the path
sys.path.append(r'd:\PROJECTS\QR maker\backend_django')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth.models import User

users = User.objects.all()
if not users:
    print("No users found in the database.")
else:
    print("Users found:")
    for user in users:
        print(f"Username: {user.username}, Is Superuser: {user.is_superuser}")
