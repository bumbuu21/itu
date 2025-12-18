const BOARD_SIZE = 8;
const BOARD_CONTAINER = document.getElementById('chessboard-container');

// Unicode for pieces (White: \u2654-\u2659, Black: \u265a-\u265f)
// This is a simplified starting position for visual purposes.
const initialBoard = [
    ['\u265c', '\u265e', '\u265d', '\u265b', '\u265a', '\u265d', '\u265e', '\u265c'], // Black Back Row
    ['\u265f', '\u265f', '\u265f', '\u265f', '\u265f', '\u265f', '\u265f', '\u265f'], // Black Pawns
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['\u2659', '\u2659', '\u2659', '\u2659', '\u2659', '\u2659', '\u2659', '\u2659'], // White Pawns
    ['\u2656', '\u2658', '\u2657', '\u2655', '\u2654', '\u2657', '\u2658', '\u2656']  // White Back Row
];

function generateBoard() {
    BOARD_CONTAINER.innerHTML = ''; // Clear board
    for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
            const square = document.createElement('div');
            // Determine color based on (r+c) parity
            square.className = `square ${(r + c) % 2 === 0 ? 'light' : 'dark'}`;
            square.dataset.row = r;
            square.dataset.col = c;
            square.textContent = initialBoard[r][c]; // Place the piece
            square.addEventListener('click', handleSquareClick);
            BOARD_CONTAINER.appendChild(square);
        }
    }
}

let selectedPiece = null; // Stores the currently selected square/piece

function handleSquareClick(event) {
    const square = event.currentTarget;
    const piece = square.textContent;

    if (!selectedPiece && piece) {
        // First click: Select a piece
        selectedPiece = square;
        square.classList.add('selected');
        document.getElementById('message-area').textContent = 'Piece selected. Now click a destination.';
        // In a real game, you would calculate and highlight valid moves here.
    } else if (selectedPiece === square) {
        // Second click on the same piece: Deselect
        selectedPiece.classList.remove('selected');
        selectedPiece = null;
        document.getElementById('message-area').textContent = 'Selection cleared.';
    } else if (selectedPiece) {
        // Second click: Attempt a move
        
        // --- BASIC MOVEMENT SKELETON (NOT VALIDATED) ---
        square.textContent = selectedPiece.textContent; // Move the piece
        selectedPiece.textContent = ''; // Clear the source square

        selectedPiece.classList.remove('selected');
        selectedPiece = null;
        document.getElementById('message-area').textContent = 'Piece moved! (No rules applied yet)';
        // In a real game, you would update the initialBoard array, swap turns, and check for check/checkmate.
    }
}

function resetGame() {
    // This is where you would fully reset your game state variables and re-draw the board.
    window.location.reload(); 
}

// Start the game when the script loads
generateBoard();