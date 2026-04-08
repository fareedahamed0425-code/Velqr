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


    let currentSize = 256;
    let currentQrBase64 = null;


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

    // --- Helper Functions ---
    function isValidUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (_) {
            return false;
        }
    }

    // --- QR Generation Logic ---
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
            // Using QRCode.js locally (added to index.html)
            qrcodeDiv.innerHTML = '';
            
            // Create a temporary container to generate the QR
            const tempDiv = document.createElement('div');
            new QRCode(tempDiv, {
                text: url,
                width: currentSize,
                height: currentSize,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            // Wait a bit for QRCode.js to render (it's synchronous but sometimes takes a tick to mount the img)
            setTimeout(() => {
                const generatedImg = tempDiv.querySelector('img');
                const qrBase64 = generatedImg ? generatedImg.src : tempDiv.querySelector('canvas').toDataURL("image/png");
                
                qrPlaceholder.classList.add('hidden');
                qrcodeDiv.classList.remove('hidden');
                
                const img = document.createElement('img');
                img.src = qrBase64;
                img.className = "w-48 h-48 opacity-90";
                qrcodeDiv.appendChild(img);
                
                currentQrBase64 = qrBase64;
                downloadBtn.disabled = false;
                
                statusBlob.classList.remove('bg-secondary');
                statusBlob.classList.add('bg-primary');
                statusText.textContent = '"The gateway has materialized. Your digital key is ready."';
                
                generateBtn.disabled = false;
                generateBtn.textContent = originalText;
            }, 100);

        } catch (error) {
            console.error(error);
            statusBlob.classList.remove('bg-secondary', 'bg-primary');
            statusBlob.classList.add('bg-error');
            statusText.textContent = '"Stability lost. The matrix failed to collapse. Check your connection."';
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

    // --- Tab Switching Logic ---
    const navGenerator = document.getElementById('nav-generator');
    const navShortener = document.getElementById('nav-shortener');
    const generatorSection = document.getElementById('generator-section');
    const shortenerSection = document.getElementById('shortener-section');

    function switchTab(tab) {
        if (tab === 'generator') {
            generatorSection.classList.remove('hidden');
            shortenerSection.classList.add('hidden');
            navGenerator.classList.add('text-[#00F5FF]', 'border-[#00F5FF]');
            navGenerator.classList.remove('text-slate-400');
            navShortener.classList.remove('text-[#00F5FF]', 'border-[#00F5FF]');
            navShortener.classList.add('text-slate-400');
        } else {
            generatorSection.classList.add('hidden');
            shortenerSection.classList.remove('hidden');
            navShortener.classList.add('text-[#00F5FF]', 'border-[#00F5FF]');
            navShortener.classList.remove('text-slate-400');
            navGenerator.classList.remove('text-[#00F5FF]', 'border-[#00F5FF]');
            navGenerator.classList.add('text-slate-400');
        }
    }

    navGenerator.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('generator');
    });

    navShortener.addEventListener('click', (e) => {
        e.preventDefault();
        switchTab('shortener');
    });

    // --- Shortener UI Elements ---
    const shortenUrlInput = document.getElementById('shorten-url-input');
    const shortenBtn = document.getElementById('shorten-btn');
    const shortenClearBtn = document.getElementById('shorten-clear-btn');
    const shortenPlaceholder = document.getElementById('shorten-placeholder');
    const shortenResult = document.getElementById('shorten-result');
    const shortUrlText = document.getElementById('short-url-text');
    const copyBtn = document.getElementById('copy-btn');
    const shortenErrorMessage = document.getElementById('shorten-error-message');
    const shortenStatusBlob = document.getElementById('shorten-status-blob');
    const shortenStatusText = document.getElementById('shorten-status-text');

    // --- Short Code Helper ---
    function generateShortCode(length = 6) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // --- Shortening Logic ---
    async function shortenURL() {
        const url = shortenUrlInput.value.trim();
        
        if (!isValidUrl(url)) {
            shortenErrorMessage.classList.remove('hidden');
            shortenUrlInput.classList.add('ring-1', 'ring-error/50');
            return;
        }

        shortenErrorMessage.classList.add('hidden');
        shortenUrlInput.classList.remove('ring-1', 'ring-error/50');

        // Loading State
        shortenBtn.disabled = true;
        const originalText = shortenBtn.textContent;
        shortenBtn.textContent = 'Distilling Data...';
        shortenStatusBlob.classList.remove('bg-primary', 'bg-outline');
        shortenStatusBlob.classList.add('bg-secondary');
        shortenStatusText.textContent = '"Compressing the information density into a single point..."';

        try {
            const db = window.firebaseDb;
            const { collection, addDoc, getDocs, query, where, serverTimestamp } = window.dbUtils;
            
            // 1. Check if URL already shortened
            const urlsRef = collection(db, "shortUrls");
            const q = query(urlsRef, where("original_url", "==", url));
            const querySnapshot = await getDocs(q);
            
            let shortCode;
            if (!querySnapshot.empty) {
                shortCode = querySnapshot.docs[0].data().short_code;
            } else {
                // 2. Generate new short code
                shortCode = generateShortCode();
                // Store in Firestore
                await addDoc(urlsRef, {
                    original_url: url,
                    short_code: shortCode,
                    created_at: serverTimestamp()
                });
            }

            const baseUrl = window.location.origin;
            const functionalUrl = `${baseUrl}/velqr/${shortCode}`;
            const brandedUrl = `http://velqr/${shortCode}`;

            shortenPlaceholder.classList.add('hidden');
            shortenResult.classList.remove('hidden');
            
            shortUrlText.textContent = functionalUrl;
            
            const testLink = document.getElementById('test-link');
            if (testLink) {
                testLink.href = functionalUrl;
            }
            
            shortenStatusBlob.classList.remove('bg-secondary');
            shortenStatusBlob.classList.add('bg-primary');
            shortenStatusText.textContent = '"The data has been condensed. Your shorter path is ready."';

        } catch (error) {
            console.error(error);
            shortenStatusBlob.classList.remove('bg-secondary', 'bg-primary');
            shortenStatusBlob.classList.add('bg-error');
            shortenStatusText.textContent = '"Compression failed: ' + error.message + '"';
        } finally {
            shortenBtn.disabled = false;
            shortenBtn.textContent = originalText;
        }
    }

    function clearShortener() {
        shortenUrlInput.value = '';
        shortenPlaceholder.classList.remove('hidden');
        shortenResult.classList.add('hidden');
        shortenErrorMessage.classList.add('hidden');
        shortenUrlInput.classList.remove('ring-1', 'ring-error/50');
        shortenStatusBlob.classList.remove('bg-primary', 'bg-error', 'bg-secondary');
        shortenStatusBlob.classList.add('bg-outline');
        shortenStatusText.textContent = '"Ready to distill your digital presence."';
    }

    function copyToClipboard() {
        const text = shortUrlText.textContent.trim();
        navigator.clipboard.writeText(text).then(() => {
            const originalContent = copyBtn.innerHTML;
            copyBtn.innerHTML = '<span class="material-symbols-outlined text-sm">check</span> Copied!';
            setTimeout(() => {
                copyBtn.innerHTML = originalContent;
            }, 2000);
        });
    }

    // --- Event Listeners ---
    // Shortener
    shortenBtn.addEventListener('click', shortenURL);
    shortenClearBtn.addEventListener('click', clearShortener);
    copyBtn.addEventListener('click', copyToClipboard);

    shortenUrlInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') shortenURL();
    });

    // Generator
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
