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

    function updateIndicator(activeTab) {
        const indicator = document.getElementById('nav-indicator');
        if (!indicator || !activeTab) return;

        const textSpan = activeTab.querySelector('span');
        if (!textSpan) return;

        // Use getBoundingClientRect for absolute precision relative to parent container
        const container = document.getElementById('nav-container');
        const containerRect = container.getBoundingClientRect();
        const textRect = textSpan.getBoundingClientRect();

        indicator.style.left = `${textRect.left - containerRect.left}px`;
        indicator.style.width = `${textRect.width}px`;
    }

    function switchTab(tab) {
        const logo = document.getElementById('nav-logo');
        const cursor = document.getElementById('cursor');
        const footer = document.getElementById('main-footer');
        const blob1 = document.getElementById('bg-blob-1');
        const blob2 = document.getElementById('bg-blob-2');
        const blob3 = document.getElementById('bg-blob-3');
        const indicator = document.getElementById('nav-indicator');

        if (tab === 'generator') {
            generatorSection.classList.remove('hidden');
            shortenerSection.classList.add('hidden');
            
            // Activate Generator Tab (Cyan)
            navGenerator.classList.add('text-[#00F5FF]');
            navGenerator.classList.remove('text-slate-400', 'hover:text-white');
            
            // Deactivate Shortener Tab
            navShortener.classList.remove('text-[#ff59e3]');
            navShortener.classList.add('text-slate-400', 'hover:text-white');
            
            // Update Indicator
            updateIndicator(navGenerator);
            if (indicator) indicator.style.backgroundColor = '#00F5FF';
            
            // Theme adjustments
            if (logo) logo.style.filter = 'drop-shadow(0 0 8px rgba(0, 245, 255, 0.5))';
            if (cursor) cursor.style.backgroundColor = 'rgba(0, 245, 255, 0.3)';
            
            if (footer) {
                footer.classList.remove('footer-pink');
                footer.classList.add('footer-cyan');
            }
            
            if (blob1) blob1.className = blob1.className.replace(/bg-\[.*?\]|bg-\w+\/\d+/g, 'bg-primary/10');
            if (blob2) blob2.className = blob2.className.replace(/bg-\[.*?\]|bg-\w+\/\d+/g, 'bg-tertiary/10');
            if (blob3) blob3.className = blob3.className.replace(/bg-\[.*?\]|bg-\w+\/\d+/g, 'bg-secondary/5');

        } else {
            generatorSection.classList.add('hidden');
            shortenerSection.classList.remove('hidden');
            
            // Activate Shortener Tab (Pink)
            navShortener.classList.add('text-[#ff59e3]');
            navShortener.classList.remove('text-slate-400', 'hover:text-white');
            
            // Deactivate Generator Tab
            navGenerator.classList.remove('text-[#00F5FF]');
            navGenerator.classList.add('text-slate-400', 'hover:text-white');

            // Update Indicator
            updateIndicator(navShortener);
            if (indicator) indicator.style.backgroundColor = '#ff59e3';
            
            // Theme adjustments
            if (logo) logo.style.filter = 'drop-shadow(0 0 8px rgba(255, 89, 227, 0.5))';
            if (cursor) cursor.style.backgroundColor = 'rgba(255, 89, 227, 0.3)';

            if (footer) {
                footer.classList.remove('footer-cyan');
                footer.classList.add('footer-pink');
            }

            if (blob1) blob1.className = blob1.className.replace(/bg-\[.*?\]|bg-\w+\/\d+/g, 'bg-secondary/10');
            if (blob2) blob2.className = blob2.className.replace(/bg-\[.*?\]|bg-\w+\/\d+/g, 'bg-tertiary/10');
            if (blob3) blob3.className = blob3.className.replace(/bg-\[.*?\]|bg-\w+\/\d+/g, 'bg-primary/5');
        }
    }

    // Initialize indicator and theme on load
    window.addEventListener('load', () => {
        switchTab('generator');
        setTimeout(() => updateIndicator(navGenerator), 100);
    });
    
    // Fallback if load already fired
    if (document.readyState === 'complete') {
        switchTab('generator');
        setTimeout(() => updateIndicator(navGenerator), 100);
    }

    window.addEventListener('resize', () => {
        const activeTab = generatorSection.classList.contains('hidden') ? navShortener : navGenerator;
        updateIndicator(activeTab);
    });

    // --- Tab Switch Listeners ---
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
    const customSlugInput = document.getElementById('custom-slug-input');
    const availabilityBadge = document.getElementById('availability-badge');
    const availabilityIcon = document.getElementById('availability-icon');
    const availabilityText = document.getElementById('availability-text');
    const slugErrorMessage = document.getElementById('slug-error-message');

    let isSlugAvailable = true;
    let debounceTimer;

    // --- Slug Availability logic ---
    async function checkSlugAvailability() {
        const slug = customSlugInput.value.trim();
        if (!slug) {
            availabilityBadge.classList.add('hidden');
            slugErrorMessage.classList.add('hidden');
            isSlugAvailable = true;
            return;
        }

        // Validate slug format (alphanumeric, dashes, underscores)
        if (!/^[a-zA-Z0-9-_]+$/.test(slug)) {
            availabilityBadge.classList.remove('hidden');
            availabilityIcon.textContent = 'error';
            availabilityIcon.className = 'material-symbols-outlined text-sm text-error';
            availabilityText.textContent = 'Invalid Format';
            availabilityText.className = 'text-[10px] font-bold uppercase tracking-wider text-error';
            isSlugAvailable = false;
            return;
        }

        availabilityBadge.classList.remove('hidden');
        availabilityIcon.textContent = 'sync';
        availabilityIcon.className = 'material-symbols-outlined text-sm text-secondary animate-spin';
        availabilityText.textContent = 'Checking...';
        availabilityText.className = 'text-[10px] font-bold uppercase tracking-wider text-secondary';

        try {
            const response = await fetch(`/api/check-availability/${slug}`);
            const data = await response.json();
            
            if (data.available) {
                availabilityIcon.textContent = 'check_circle';
                availabilityIcon.className = 'material-symbols-outlined text-sm text-primary';
                availabilityText.textContent = 'Available';
                availabilityText.className = 'text-[10px] font-bold uppercase tracking-wider text-primary';
                slugErrorMessage.classList.add('hidden');
                isSlugAvailable = true;
            } else {
                availabilityIcon.textContent = 'cancel';
                availabilityIcon.className = 'material-symbols-outlined text-sm text-error';
                availabilityText.textContent = 'Taken';
                availabilityText.className = 'text-[10px] font-bold uppercase tracking-wider text-error';
                slugErrorMessage.classList.remove('hidden');
                isSlugAvailable = false;
            }
        } catch (error) {
            console.error('Availability check failed:', error);
            availabilityBadge.classList.add('hidden');
        }
    }

    customSlugInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(checkSlugAvailability, 500);
    });

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
        const customSlug = customSlugInput.value.trim();
        
        if (!isValidUrl(url)) {
            shortenErrorMessage.classList.remove('hidden');
            shortenUrlInput.classList.add('ring-1', 'ring-error/50');
            return;
        }

        if (customSlug && !isSlugAvailable) {
            slugErrorMessage.classList.remove('hidden');
            customSlugInput.focus();
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
            
            const urlsRef = collection(db, "shortUrls");
            let shortCode;

            if (customSlug) {
                // Use custom slug
                shortCode = customSlug;
                // Double check availability one last time
                const q = query(urlsRef, where("short_code", "==", shortCode));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    throw new Error("Slug already taken.");
                }
            } else {
                // 1. Check if URL already shortened (only if no custom slug provided)
                const q = query(urlsRef, where("original_url", "==", url));
                const querySnapshot = await getDocs(q);
                
                if (!querySnapshot.empty) {
                    shortCode = querySnapshot.docs[0].data().short_code;
                } else {
                    // 2. Generate new short code
                    shortCode = generateShortCode();
                }
            }

            // Save if it's new (or if it's a custom slug that isn't saved yet)
            const checkQuery = query(urlsRef, where("short_code", "==", shortCode));
            const checkSnap = await getDocs(checkQuery);
            
            if (checkSnap.empty) {
                await addDoc(urlsRef, {
                    original_url: url,
                    short_code: shortCode,
                    created_at: serverTimestamp()
                });
            }

            const baseUrl = window.location.origin;
            // Support root-level URLs as requested
            const functionalUrl = `${baseUrl}/${shortCode}`;

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
        customSlugInput.value = '';
        availabilityBadge.classList.add('hidden');
        slugErrorMessage.classList.add('hidden');
        shortenPlaceholder.classList.remove('hidden');
        shortenResult.classList.add('hidden');
        shortenErrorMessage.classList.add('hidden');
        shortenUrlInput.classList.remove('ring-1', 'ring-error/50');
        shortenStatusBlob.classList.remove('bg-primary', 'bg-error', 'bg-secondary');
        shortenStatusBlob.classList.add('bg-outline');
        shortenStatusText.textContent = '"Ready to distill your digital presence."';
        isSlugAvailable = true;
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
