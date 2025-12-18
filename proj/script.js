// script.js

// 1. DATA: Add your hollow image URLs here!
const imageList = [
    "img/1.png",  // This points to your first image
    "img/2.png",
    "img/3.png",
    "img/4.png",
    "img/5.png",
    "img/6.png",
    "img/7.png",
    "img/8.png",
    "img/9.png",
    "img/10.png"
];

// 2. SETUP
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay-img');
const brushSlider = document.getElementById('brushSize');

canvas.width = 600;
canvas.height = 450;

let isPainting = false;
let currentColor = '#FF6B6B';
let currentBackgroundImg = null;



// Function to set canvas resolution based on screen size


// Call it once at start


// 3. SCREEN SWITCHING LOGIC
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    // Show the target screen
    document.getElementById(screenId).style.display = 'flex';

    // If going to gallery, build it
    if(screenId === 'gallery-screen') {
        renderGallery();
    }
}

// 4. GALLERY LOGIC
function renderGallery() {
    const container = document.getElementById('imageGallery');
    container.innerHTML = ''; // Clear old content

    imageList.forEach(imgUrl => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `<img src="${imgUrl}">`;
        div.onclick = () => selectPicture(imgUrl);
        container.appendChild(div);
    });
}

function selectPicture(url) {
    const img = new Image();
    img.src = url;
    
    img.onload = () => {
        currentBackgroundImg = img; // Store the image for later
        resetCanvasWithImage();     // Use a helper function to draw it
        showScreen('paint-screen');
    };
}

// 5. PAINTING LOGIC
function getPosition(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
        x: clientX - rect.left,
        y: clientY - rect.top
    };
}

function startDrawing(e) {
    isPainting = true;
    draw(e);
}

function stopDrawing() {
    isPainting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!isPainting) return;
    const pos = getPosition(e);
    
    ctx.lineWidth = brushSlider.value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = currentColor;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
window.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e); });
canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });
canvas.addEventListener('touchend', stopDrawing);

function changeColor(c) { currentColor = c; }
function clearCanvas() {
    // 1. Wipe everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 2. If we have a background image, put it back immediately
    if (currentBackgroundImg) {
        ctx.drawImage(currentBackgroundImg, 0, 0, canvas.width, canvas.height);
    }
}

// Helper function to handle the initial draw
function resetCanvasWithImage() {
    clearCanvas();
}


function downloadImage() {
    const link = document.createElement('a');
    link.download = 'my-painting.png';
    link.href = canvas.toDataURL();
    link.click();
}