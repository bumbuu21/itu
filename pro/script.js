// 1. DATA: Add your hollow image URLs here!
// Ensure these images exist in your 'img' folder
const imageList = [
    "img/1.png", 
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

// Set internal resolution (higher = sharper lines)
// We set it once here, but display size is handled by CSS
canvas.width = 800;
canvas.height = 600;

let isPainting = false;
let currentColor = '#FF6B6B';

// 3. SCREEN SWITCHING LOGIC
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.style.display = 'none';
    });
    document.getElementById(screenId).style.display = 'flex';

    if(screenId === 'gallery-screen') {
        renderGallery();
    }
}

// 4. GALLERY LOGIC
function renderGallery() {
    const container = document.getElementById('imageGallery');
    container.innerHTML = ''; 

    imageList.forEach(imgUrl => {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.innerHTML = `<img src="${imgUrl}" loading="lazy">`;
        div.onclick = () => selectPicture(imgUrl);
        container.appendChild(div);
    });
}

function selectPicture(url) {
    // 1. Show the hollow image as an overlay
    overlay.src = url; 
    
    // 2. Clear previous painting
    clearCanvas();
    
    // 3. Switch screen
    showScreen('paint-screen');
}

// 5. PAINTING LOGIC (THE RESPONSIVE FIX)
function getPosition(e) {
    // Get the bounding rectangle of the canvas visually on screen
    const rect = canvas.getBoundingClientRect();
    
    // Handle Touch vs Mouse
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    // Calculate scaling factors (Bitmap Resolution / Visual Size)
    // This fixes the offset issues when resizing the window
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function startDrawing(e) {
    // Prevent scrolling when touching canvas
    if (e.target === canvas) {
        e.preventDefault(); 
    }
    
    isPainting = true;
    draw(e);
}

function stopDrawing() {
    isPainting = false;
    ctx.beginPath(); // Reset path so lines don't connect
}

function draw(e) {
    if (!isPainting) return;
    
    // Prevent default scrolling behavior on touch devices
    if(e.type === 'touchmove') {
       e.preventDefault();
    }

    const pos = getPosition(e);
    
    ctx.lineWidth = brushSlider.value;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round'; // Smoother corners
    ctx.strokeStyle = currentColor;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    
    // Reset path start to current position for smoother drawing
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

// Event Listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch Support (Passive: false is important for preventDefault)
canvas.addEventListener('touchstart', startDrawing, { passive: false });
canvas.addEventListener('touchmove', draw, { passive: false });
canvas.addEventListener('touchend', stopDrawing);


// 6. UTILITIES
function changeColor(c) { 
    currentColor = c; 
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function downloadImage() {
    // Create a temporary canvas to merge the drawing + the outline
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tCtx = tempCanvas.getContext('2d');

    // 1. Draw a white background first (so it's not transparent)
    tCtx.fillStyle = '#FFFFFF';
    tCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

    // 2. Draw the kid's artwork
    tCtx.drawImage(canvas, 0, 0);

    // 3. Draw the outline image on top
    // We need to load the overlay image into the JS context to draw it
    const outlineImg = new Image();
    outlineImg.src = overlay.src;
    outlineImg.onload = () => {
        tCtx.drawImage(outlineImg, 0, 0, tempCanvas.width, tempCanvas.height);
        
        // 4. Trigger download
        const link = document.createElement('a');
        link.download = 'my-masterpiece.png';
        link.href = tempCanvas.toDataURL();
        link.click();
    };
}