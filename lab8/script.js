const questionsPool = [
    { q: 'Fruit', a: 'APPLE' },
    { q: 'Fruit', a: 'PEAR' },
    { q: 'Fruit', a: 'PINEAPPLE' },
    { q: 'Fruit', a: 'WATERMELON' },
    { q: 'Fruit', a: 'GRAPE' },
    { q: 'Fruit', a: 'BANANA' },
    { q: 'Fruit', a: 'STRAWBERRY' },
    { q: 'City' , a: 'ULAANBAATAR' },
    { q: 'City' , a: 'SEOUL' },
    { q: 'City' , a: 'TOKYO' },
    { q: 'City' , a: 'ERDENET' },
    { q: 'City' , a: 'BEIJING' },
    { q: 'City' , a: 'SHANGHAI' },
    { q: 'City' , a: 'BUDEPEST' },
    { q: 'City' , a: 'PARIS' },
    { q: 'City' , a: 'AUSTIN' },
    { q: 'Animal', a: 'LION' },
    { q: 'Animal', a: 'TIGER' },
    { q: 'Animal', a: 'ANT' },
    { q: 'Animal', a: 'CAT' },
    { q: 'Animal', a: 'DOG' },
    { q: 'Animal', a: 'EAGLE' },
    { q: 'Animal', a: 'MONKEY' },
    { q: 'Animal', a: 'RHINO' },
    { q: 'Animal', a: 'ELEPHANT' },
    { q: 'Planet', a: 'MARS' },
    { q: 'Planet', a: 'EARTH' },
    { q: 'Planet', a: 'URANUS' },
    { q: 'Planet', a: 'NEPTUNE' },
    { q: 'Planet', a: 'VENUS' },
    { q: 'Planet', a: 'MERCURY' },
    { q: 'Planet', a: 'SATURN' },
    { q: 'Planet', a: 'JUPITER' },
    { q: 'Color', a: 'RED' },
    { q: 'Color', a: 'ORANGE' },
    { q: 'Color', a: 'BLUE' },
    { q: 'Color', a: 'YELLOW' },
    { q: 'Color', a: 'GREEN' },
    { q: 'Color', a: 'BLACK' },
    { q: 'Color', a: 'CYAN' },
    { q: 'Color', a: 'WHITE' },
    { q: 'Color', a: 'GREY' },
    { q: 'Color', a: 'PURPLE' },
    { q: 'Color', a: 'BROWN' },
    { q: 'Color', a: 'PINK' },
    { q: 'Biggest Mammal?', a: 'WHALE' },
    { q: 'King of the Jungle?', a: 'LION' },
    { q: 'The bird that cannot fly?', a: 'OSTRICH' },
    { q: 'Animal with a very long neck?', a: 'GIRAFFE' },
    { q: 'A sea creature with eight arms?', a: 'OCTOPUS' },
    
    { q: 'Capital of Mongolia?', a: 'ULAANBAATAR' },
    { q: 'Largest ocean on Earth?', a: 'PACIFIC' },
    { q: 'The country of the Rising Sun?', a: 'JAPAN' },
    { q: 'Highest mountain in the world?', a: 'EVEREST' },
    { q: 'Longest river in the world?', a: 'NILE' },
    { q: 'The desert that covers much of North Africa?', a: 'SAHARA' },
    
    { q: 'Planet known as the Red Planet?', a: 'MARS' },
    { q: 'Closest star to Earth?', a: 'SUN' },
    { q: 'What gas do humans breathe to survive?', a: 'OXYGEN' },
    { q: 'The planet with famous rings?', a: 'SATURN' },
    
    { q: 'Fastest vehicle?', a: 'JET' },
    { q: 'Who created the light bulb?', a: 'EDISON' },
    { q: 'Search engine starting with G?', a: 'GOOGLE' },
    
    { q: 'Popular Fruit?', a: 'APPLE' },
    { q: 'What is the color of an emerald?', a: 'GREEN' },
    { q: 'Musical instrument with 88 keys?', a: 'PIANO' },
    { q: 'The sport with a "Home Run"?', a: 'BASEBALL' },
    { q: 'A shape with three sides?', a: 'TRIANGLE' }
];

let availableQuestions = [];
let selectedAnswer = "";
let currentStep = 0; 
let mistakes = 0;
let score = 0;
let highScore = 0;
const maxMistakes = 6;

function startGame() {
    score = 0;
    mistakes = 0; // Тоглоом бүрэн эхлэхэд алдааг тэгэлнэ
    availableQuestions = [...questionsPool];
    
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    
    resetCanvas(); // Зөвхөн хамгийн эхэнд дүүжлүүрийг цэвэрлэнэ
    nextRound();
}

function nextRound() {
    if (availableQuestions.length === 0) {
        endGame("Гайхалтай! Та бүх асуултанд хариуллаа! 🎉", "#55efc4", true);
        return;
    }

    const randomIndex = Math.floor(Math.random() * availableQuestions.length);
    const currentObj = availableQuestions[randomIndex];
    selectedAnswer = currentObj.a.toUpperCase();
    availableQuestions.splice(randomIndex, 1);

    currentStep = 0; 
    // Энд 'mistakes = 0' болон 'resetCanvas()' байхгүй болсон
    
    document.getElementById('question-text').innerText = "Асуулт: " + currentObj.q;
    document.getElementById('message').innerText = "";
    document.getElementById('score-display').innerText = "Оноо: " + score;
    
    updateDisplay();
    createLetterButtons();
}

function createLetterButtons() {
    const container = document.getElementById('letters-container');
    container.innerHTML = "";
    let lettersArray = selectedAnswer.split("");
    lettersArray.sort(() => Math.random() - 0.5);

    lettersArray.forEach((letter) => {
        const btn = document.createElement('button');
        btn.innerText = letter;
        btn.className = "letter-btn";
        
        btn.onclick = () => {
            if (letter === selectedAnswer[currentStep]) {
                currentStep++;
                btn.style.visibility = "hidden";
                btn.disabled = true;
                updateDisplay();
            } else {
                mistakes++;
                drawHangman(mistakes); // Алдах бүрт зураг нэмэгдэнэ
                btn.classList.add('wrong');
                setTimeout(() => btn.classList.remove('wrong'), 300);

                if (mistakes === maxMistakes) {
                    if (score > highScore) highScore = score;
                    endGame("Ялагдлаа! 💀 Хариулт: " + selectedAnswer, "#ff7675", false);
                }
            }
        };
        container.appendChild(btn);
    });
}

function updateDisplay() {
    let displayString = "";
    for (let i = 0; i < selectedAnswer.length; i++) {
        displayString += (i < currentStep) ? selectedAnswer[i] : "_";
    }
    document.getElementById('word-display').innerText = displayString;

    if (currentStep === selectedAnswer.length) {
        score++;
        document.getElementById('message').innerText = "Зөв! Дараагийн асуулт...";
        document.getElementById('message').style.color = "#55efc4";
        
        // Хэсэг хугацааны дараа дараагийн асуулт руу шилжинэ
        setTimeout(() => {
            nextRound();
        }, 1200);
    }
}

function endGame(msg, color, isWin) {
    const messageEl = document.getElementById('message');
    messageEl.innerText = msg;
    messageEl.style.color = color;

    const buttons = document.querySelectorAll('.letter-btn');
    buttons.forEach(btn => btn.disabled = true);

    const startBtn = document.getElementById('start-btn');
    startBtn.style.display = 'inline-block';
    startBtn.innerText = isWin ? "Дахин эхлэх" : "Дахин оролдох";
    
    document.getElementById('score-display').innerText = `Оноо: ${score} | Дээд амжилт: ${highScore}`;
}

// Canvas функцүүд (өөрчлөлт ороогүй)
function resetCanvas() {
    const canvas = document.getElementById('hangmanCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#2d3436"; ctx.lineWidth = 4; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(20, 180); ctx.lineTo(160, 180);
    ctx.moveTo(40, 180); ctx.lineTo(40, 20);
    ctx.lineTo(120, 20); ctx.lineTo(120, 40);
    ctx.stroke();
}

function drawHangman(step) {
    const ctx = document.getElementById('hangmanCanvas').getContext('2d');
    ctx.strokeStyle = "#d63031"; ctx.lineWidth = 4;
    switch(step) {
        case 1: ctx.beginPath(); ctx.arc(120, 60, 20, 0, Math.PI * 2); ctx.stroke(); break;
        case 2: ctx.beginPath(); ctx.moveTo(120, 80); ctx.lineTo(120, 130); ctx.stroke(); break;
        case 3: ctx.beginPath(); ctx.moveTo(120, 90); ctx.lineTo(95, 115); ctx.stroke(); break;
        case 4: ctx.beginPath(); ctx.moveTo(120, 90); ctx.lineTo(145, 115); ctx.stroke(); break;
        case 5: ctx.beginPath(); ctx.moveTo(120, 130); ctx.lineTo(100, 165); ctx.stroke(); break;
        case 6: ctx.beginPath(); ctx.moveTo(120, 130); ctx.lineTo(140, 165); ctx.stroke(); break;
    }
}