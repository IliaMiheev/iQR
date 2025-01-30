const textInput = document.getElementById('text-input');
const generateBtn = document.getElementById('generate-btn');
const downloadQrBtn = document.getElementById('download-qr-btn');
const qrCodeDiv = document.getElementById('qr-code');
const delBtn = document.getElementById('del-qr-btn');
const textError = document.getElementById('error');

function logMessage(message, color = 'red') {
    textError.innerText = message;
    textError.style.color = color;
}

// Генерация QR-кода
function generateQRCode() {
    const text = textInput.value.trim();
    if (!text) {
        logMessage('Введите текст для генерации QR-кода!');
        return;
    }
    qrCodeDiv.innerHTML = '';
    QRCode.toCanvas(text, (error, canvas) => {
        if (error) {
            console.error(error);
            logMessage('Ошибка при генерации QR-кода.');
            return;
        }
        qrCodeDiv.appendChild(canvas);
        logMessage('');
    });
}

// Обработчик клика по кнопке "Сгенерировать"
generateBtn.addEventListener('click', generateQRCode);

// Скачивание QR-кода
downloadQrBtn.addEventListener('click', () => {
    text = textInput.value.slice(0, 20)
    const canvas = qrCodeDiv.querySelector('canvas');
    if (!canvas) {
        logMessage('QR-код не сгенерирован!');
        return;
    }
    if (!text) {
        logMessage('Отсутствует текст в поле для ввода');
        return;
    }

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `qr-code-${text}.png`;
    link.click();
    logMessage('QR-код скачан!', 'green');
});

// Удаление данных
delBtn.addEventListener('click', () => {
    textInput.value = '';
    qrCodeDiv.innerHTML = '';
    textError.innerText = '';
});
