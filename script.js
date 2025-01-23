const qr = qrcode(400, 'M');
const form = document.getElementById('qr-form');
const input = document.getElementById('qr-input');
const size = document.getElementById('qr-size');
const button = document.getElementById('qr-button');
const result = document.getElementById('qr-result');
const spinner = document.getElementById('qr-spinner');
const message = document.getElementById('qr-message');
const code = document.getElementById('qr-code');
const downloadBtn = document.getElementById('download-btn');

/**
 * @param {Event} e - The event object
 * @description Handles the form submission for QR code generation
 * @returns {void}
 */
const onQRFormSubmit = (e) => {
    e.preventDefault();
    spinner.classList.remove('hidden');
    message.classList.remove('hidden');
    downloadBtn.classList.add('hidden');
    message.textContent = 'Generating QR Code...';
    input.classList.remove('border-red-500');
    size.classList.remove('border-red-500');

    if (!input?.value) {
        spinner.classList.add('hidden');
        message.textContent = 'Please enter a URL';
        input.classList.add('border-red-500');
        hideMessageAfterDelay();
        return;
    }

    if (!size?.value) {
        spinner.classList.add('hidden');
        message.textContent = 'Please select a size';
        size.classList.add('border-red-500');
        return;
    }

    const url = input.value;
    const sizeValue = parseInt(size.value);

    try {
        const qr = qrcode(0, 'M');  // Let the library determine version
        qr.addData(url);
        qr.make();
        // Increase cell size and add margin for better quality
        const cellSize = Math.floor(sizeValue / qr.getModuleCount());
        const qrCode = qr.createImgTag(cellSize, 4);  // cellSize and margin of 4
        code.innerHTML = qrCode;
        spinner.classList.add('hidden');
        downloadBtn.classList.remove('hidden');
        message.textContent = 'QR Code generated successfully!';
        hideMessageAfterDelay();
    } catch (error) {
        message.textContent = 'Failed to generate QR Code';
        spinner.classList.add('hidden');
        hideMessageAfterDelay();
    }
}

/**
 * @description Hides the message after a delay
 * @returns {void}
 */
const hideMessageAfterDelay = () => {
    setTimeout(() => {
        message.classList.add('hidden');
    }, 10000);
}

/**
 * @description Hides the spinner after a delay
 * @returns {void}
 */
const hideSpinnerAfterDelay = () => {
    setTimeout(() => {
        spinner.classList.add('hidden');
    }, 10000);
}

/**
 * @description Adds event listeners to the form and download button
 * @returns {void}
 */
form.addEventListener('submit', onQRFormSubmit);

/**
 * @description Adds event listeners to the download button
 * @returns {void}
 */
downloadBtn.addEventListener('click', () => {
    const qrImage = code.querySelector('img');
    if (qrImage) {
        // Wait for image to load completely
        const loadImage = () => {
            // Create a canvas element with padding
            const canvas = document.createElement('canvas');
            const padding = 40; // 20px padding on each side
            canvas.width = qrImage.naturalWidth + (padding * 2);
            canvas.height = qrImage.naturalHeight + (padding * 2);
            
            const ctx = canvas.getContext('2d');
            
            // Fill white background with padding
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw the QR code in the center
            ctx.drawImage(
                qrImage, 
                padding, // x position
                padding, // y position
                qrImage.naturalWidth,
                qrImage.naturalHeight
            );
            
            // Convert canvas to blob and download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'qr-code.png';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }, 'image/png');
        };

        // If image is already loaded, process it immediately
        if (qrImage.complete) {
            loadImage();
        } else {
            // Wait for image to load before processing
            qrImage.onload = loadImage;
        }
    }
}); 