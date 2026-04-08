document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const urlInput = document.getElementById('url-input');
    const sizeSelector = document.getElementById('size-selector');
    const sizeButtons = sizeSelector.querySelectorAll('button');
    const generateBtn = document.getElementById('generate-btn');
    const clearBtn = document.getElementById('clear-btn');
    const downloadBtn = document.getElementById('download-btn');
    const qrcodeDiv = document.getElementById('qrcode');
    const qrPlaceholder = document.getElementById('qr-placeholder');
    const errorMessage = document.getElementById('error-message');
    const statusBlob = document.getElementById('status-blob');
    const statusText = document.getElementById('status-text');
    const cursor = document.getElementById('cursor');

    let currentSize = 256;
    let currentQrBase64 = null;

    // --- Custom Cursor Logic ---
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.querySelectorAll('button, a, input').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(3)';
            cursor.style.background = 'rgba(161, 250, 255, 0.15)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'rgba(161, 250, 255, 0.3)';
        });
    });

    document.addEventListener('mouseenter', () => cursor.classList.remove('hidden'));
    document.addEventListener('mouseleave', () => cursor.classList.add('hidden'));

    // --- Size Selection Logic ---
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            sizeButtons.forEach(b => {
                b.classList.remove('bg-surface-container-highest', 'text-primary', 'shadow-lg', 'shadow-black/20');
                b.classList.add('text-on-surface-variant');
            });
            btn.classList.add('bg-surface-container-highest', 'text-primary', 'shadow-lg', 'shadow-black/20');
            btn.classList.remove('text-on-surface-variant');
            currentSize = parseInt(btn.dataset.size);
        });
    });

    // --- QR Generation Logic ---
    function isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (_) {
            return false;
        }
    }

    async function generateQR() {
        const url = urlInput.value.trim();
        
        if (!isValidUrl(url)) {
            errorMessage.classList.remove('hidden');
            urlInput.classList.add('ring-1', 'ring-error/50');
            return;
        }

        errorMessage.classList.add('hidden');
        urlInput.classList.remove('ring-1', 'ring-error/50');

        // Loading State
        generateBtn.disabled = true;
        const originalText = generateBtn.textContent;
        generateBtn.textContent = 'Forging Artifact...';
        statusBlob.classList.remove('bg-primary', 'bg-outline');
        statusBlob.classList.add('bg-secondary');
        statusText.textContent = '"Channeling the data stream into the refractive matrix..."';

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    url: url,
                    size: currentSize,
                    color: "#000000" // Always black
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                // Display QR
                qrcodeDiv.innerHTML = '';
                qrPlaceholder.classList.add('hidden');
                qrcodeDiv.classList.remove('hidden');
                
                const img = document.createElement('img');
                img.src = data.qr_code;
                img.className = "w-48 h-48 opacity-90";
                qrcodeDiv.appendChild(img);
                
                currentQrBase64 = data.qr_code;
                downloadBtn.disabled = false;
                
                statusBlob.classList.remove('bg-secondary');
                statusBlob.classList.add('bg-primary');
                statusText.textContent = '"The gateway has materialized. Your digital key is ready."';
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error(error);
            statusBlob.classList.remove('bg-secondary', 'bg-primary');
            statusBlob.classList.add('bg-error');
            statusText.textContent = '"Stability lost. The matrix failed to collapse. Check your connection."';
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = originalText;
        }
    }

    function clearAll() {
        urlInput.value = '';
        qrcodeDiv.innerHTML = '';
        qrcodeDiv.classList.add('hidden');
        qrPlaceholder.classList.remove('hidden');
        downloadBtn.disabled = true;
        errorMessage.classList.add('hidden');
        urlInput.classList.remove('ring-1', 'ring-error/50');
        statusBlob.classList.remove('bg-primary', 'bg-error', 'bg-secondary');
        statusBlob.classList.add('bg-outline');
        statusText.textContent = '"The path is ready. Your ethereal gateway will materialize here upon generation."';
        currentQrBase64 = null;
    }

    function downloadQR() {
        if (!currentQrBase64) return;
        const link = document.createElement('a');
        link.download = `velqr-artifact-${Date.now()}.png`;
        link.href = currentQrBase64;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Listeners
    generateBtn.addEventListener('click', generateQR);
    clearBtn.addEventListener('click', clearAll);
    downloadBtn.addEventListener('click', downloadQR);

    urlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') generateQR();
    });

    urlInput.addEventListener('input', () => {
        errorMessage.classList.add('hidden');
        urlInput.classList.remove('ring-1', 'ring-error/50');
    });
});
