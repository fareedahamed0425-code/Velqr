from django.http import JsonResponse, HttpResponseRedirect
from django.shortcuts import get_object_or_404, render
from django.views.decorators.csrf import csrf_exempt

def index(request):
    return render(request, 'index.html')
import json
import qrcode
import io
import base64
from .models import ShortURL

@csrf_exempt
def generate_qr(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Only POST method is allowed"}, status=405)
    
    try:
        data = json.loads(request.body)
        url = data.get('url')
        size = data.get('size', 256)
        color = data.get('color', '#000000')
        
        if not url:
            return JsonResponse({"error": "URL is required"}, status=400)
            
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
        
        return JsonResponse({
            "status": "success",
            "qr_code": f"data:image/png;base64,{img_str}"
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def shorten_url(request):
    if request.method != 'POST':
        return JsonResponse({"error": "Only POST method is allowed"}, status=405)
    
    try:
        data = json.loads(request.body)
        url = data.get('url')
        
        if not url:
            return JsonResponse({"error": "URL is required"}, status=400)
        
        # Check if already exists to avoid duplicates
        short_obj, created = ShortURL.objects.get_or_create(original_url=url)
        
        # Branded URL for display/sharing
        branded_url = f"http://velqr/{short_obj.short_code}"
        # Functional URL for local testing
        functional_url = f"{request.build_absolute_uri('/')}velqr/{short_obj.short_code}"
        
        return JsonResponse({
            "status": "success",
            "short_url": branded_url,
            "functional_url": functional_url,
            "short_code": short_obj.short_code
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def redirect_url(request, short_code):
    short_obj = get_object_or_404(ShortURL, short_code=short_code)
    return HttpResponseRedirect(short_obj.original_url)

def health(request):
    return JsonResponse({"status": "up"})
