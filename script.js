const textInput = document.getElementById('text-input');
const generateBtn = document.getElementById('generate-btn');
const downloadQrBtn = document.getElementById('download-qr-btn');
const qrCodeDiv = document.getElementById('qr-code');
const delBtn = document.getElementById('del-qr-btn');
const textError = document.getElementById('error');
const zoomInBtn = document.getElementById('zoom-in-btn');
const zoomOutBtn = document.getElementById('zoom-out-btn');
let scale = 1; // Начальный масштаб
const checkbox = document.getElementById('isLightTheme');
const html = document.getElementsByTagName('html')[0];

// Установление значения поля ввода из local storage
window.onload = () => {
    let inputText = localStorage.getItem('userText');
    if (inputText) {
        textInput.value = inputText;
        generateQR()
    } else {
        localStorage.setItem('userText', '')
    }
}

function changeButtonsColor(color) {
    const buttons = document.getElementsByTagName('button');
    for (let index = 0; index < buttons.length; index++) {
        const btn = buttons[index];
        btn.style.color = color;
    }
}

checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        html.style.backgroundColor = '#fff';
        changeButtonsColor('#1e1e1e')
    } else {
        html.style.backgroundColor = '#1e1e1e';
        changeButtonsColor('#fff')
    }
})


// Вывести сообщение пользователю
function logMessage(message, color = 'red') {
    textError.innerText = message;
    textError.style.color = color;
}

function generateQR() {
    const userText = textInput.value.trim();
    if (!userText) {
        logMessage('Введите текст для генерации QR-кода!');
        return;
    };
    localStorage.setItem('userText', userText);
    qrCodeDiv.innerHTML = '';
    QRCode.toCanvas(userText, (error, canvas) => {
        if (error) {
            console.error(error);
            logMessage('Ошибка при генерации QR-кода.');
            return;
        }
        qrCodeDiv.appendChild(canvas);
        logMessage('');
        canvas.style.transform = `scale(${scale})`;
        canvas.style.transformOrigin = 'top';
    })
    const canvas = qrCodeDiv.querySelector('canvas');
    let canvasWidth = canvas.getBoundingClientRect().width;
    if (canvasWidth > window.innerWidth * 0.8) {
        scale = 1;
    }
}

// Генерация QR-кода
generateBtn.addEventListener('click', generateQR);

// Скачивание QR-кода
downloadQrBtn.addEventListener('click', () => {
    let userText = textInput.value.slice(0, 20)
    const canvas = qrCodeDiv.querySelector('canvas');
    if (!canvas) {
        logMessage('QR-код не сгенерирован!');
        return;
    }
    if (!userText) {
        logMessage('Отсутствует текст в поле для ввода');
        return;
    }

    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `qr-code-${userText}.png`;
    link.click();
    logMessage('QR-код скачан!', 'green');
});

// Удаление данных
delBtn.addEventListener('click', () => {
    textInput.value = '';
    qrCodeDiv.innerHTML = '';
    textError.innerText = '';
    scale = 1;
    localStorage.removeItem('userText');
});

// Изменить значение шкалы
function chengeScale(scale) {
    const canvas = qrCodeDiv.querySelector('canvas');
    logMessage('')
    canvas.style.transform = `scale(${scale})`;
};

// Увеличение QR-кода
zoomInBtn.addEventListener('click', () => {
    const canvas = qrCodeDiv.querySelector('canvas');
    if (!canvas) {
        logMessage('До генерации QR кода маштаб менять нельзя')
        return
    }
    let canvasWidth = canvas.getBoundingClientRect().width;
    if (canvasWidth + 0.1 < (window.innerWidth * 0.8)) {
        scale += 0.1; // Увеличить масштаб на 10%
        chengeScale(scale)
    } else {
        logMessage('Достигнут максимальный размер QR кода')
    }
});

// Уменьшение QR-кода
zoomOutBtn.addEventListener('click', () => {
    const canvas = qrCodeDiv.querySelector('canvas');
    if (!canvas) {
        logMessage('До генерации QR кода маштаб менять нельзя')
        return
    }
    let canvasWidth = canvas.getBoundingClientRect().width;
    if (canvasWidth > window.innerWidth * 0.8) {
        scale = 1;
    }
    if (scale > 0.5) {
        scale -= 0.1; // Уменьшить масштаб на 10%
        chengeScale(scale)
    } else {
        logMessage('Достигнут минимальный размер QR кода')
    }
});