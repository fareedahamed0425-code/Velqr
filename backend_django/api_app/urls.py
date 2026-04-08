from django.urls import path, re_path
from django.views.static import serve
from django.conf import settings
from . import views
import os

urlpatterns = [
    path('', views.index, name='index'),
    path('generate', views.generate_qr, name='generate_qr'),
    path('shorten_url', views.shorten_url, name='shorten_url'),
    path('velqr/<str:short_code>', views.redirect_url, name='redirect_url'),
    path('health', views.health, name='health'),
    # Serve static files from the frontend directory
    re_path(r'^(?P<path>.*)$', serve, {'document_root': os.path.join(settings.BASE_DIR, '../frontend')}),
]
