// Game state
let gameState = {
    cards: [],
    flipped: [],
    matched: [],
    moves: 0,
    score: 0,
    bestScore: localStorage.getItem('bestScore') || 0,
    difficulty: 'medium',
    gameActive: true,
    history: []
};

// Difficulty configurations
const difficulties = {
    easy: { rows: 4, cols: 4 },
    medium: { rows: 4, cols: 6 },
    hard: { rows: 6, cols: 6 }
};

// Initialize game on page load
document.addEventListener('DOMContentLoaded', () => {
    updateBestScore();
    resetGame();
});

// Create and shuffle cards
function createCards() {
    const config = difficulties[gameState.difficulty];
    const totalCards = config.rows * config.cols;
    const pairs = totalCards / 2;
    
    gameState.cards = [];
    for (let i = 1; i <= pairs; i++) {
        gameState.cards.push(i);
        gameState.cards.push(i);
    }
    
    // Shuffle cards
    gameState.cards = gameState.cards.sort(() => Math.random() - 0.5);
}

// Render game board
function renderBoard() {
    const board = document.getElementById('gameBoard');
    const config = difficulties[gameState.difficulty];
    
    board.className = `game-board ${gameState.difficulty}`;
    board.innerHTML = '';
    
    gameState.cards.forEach((number, index) => {
        const card = document.createElement('button');
        card.className = 'card';
        
        if (gameState.matched.includes(index)) {
            card.classList.add('matched');
            card.textContent = gameState.cards[index];
            card.disabled = true;
        } else if (gameState.flipped.includes(index)) {
            card.classList.add('flipped');
            card.textContent = gameState.cards[index];
        } else {
            card.textContent = '?';
        }
        
        card.onclick = () => flipCard(index);
        board.appendChild(card);
    });
}

// Flip card logic
function flipCard(index) {
    if (!gameState.gameActive) return;
    if (gameState.matched.includes(index)) return;
    if (gameState.flipped.includes(index)) return;
    if (gameState.flipped.length === 2) return;
    
    // Save state for undo
    gameState.history.push({
        flipped: [...gameState.flipped],
        matched: [...gameState.matched],
        moves: gameState.moves,
        score: gameState.score
    });
    
    gameState.flipped.push(index);
    renderBoard();
    
    if (gameState.flipped.length === 2) {
        gameState.moves++;
        document.getElementById('moves').textContent = gameState.moves;
        checkMatch();
    }
}

// Check if flipped cards match
function checkMatch() {
    const [first, second] = gameState.flipped;
    const match = gameState.cards[first] === gameState.cards[second];
    
    setTimeout(() => {
        if (match) {
            gameState.matched.push(first, second);
            gameState.score += 10;
            document.getElementById('score').textContent = gameState.score;
            gameState.flipped = [];
            renderBoard();
            
            if (gameState.matched.length === gameState.cards.length) {
                endGame();
            }
        } else {
            gameState.flipped = [];
            renderBoard();
        }
    }, 600);
}

// End game
function endGame() {
    gameState.gameActive = false;
    document.getElementById('gameStatus').textContent = 
        `🎉 You Won! Final Score: ${gameState.score} | Moves: ${gameState.moves}`;
    
    if (gameState.score > gameState.bestScore) {
        gameState.bestScore = gameState.score;
        localStorage.setItem('bestScore', gameState.bestScore);
        updateBestScore();
        document.getElementById('gameStatus').textContent += ' 🏆 New Best Score!';
    }
}

// Reset game
function resetGame() {
    gameState.flipped = [];
    gameState.matched = [];
    gameState.moves = 0;
    gameState.score = 0;
    gameState.gameActive = true;
    gameState.history = [];
    
    createCards();
    renderBoard();
    
    document.getElementById('moves').textContent = '0';
    document.getElementById('score').textContent = '0';
    document.getElementById('gameStatus').textContent = 'Ready to play!';
}

// Change difficulty
function changeDifficulty() {
    gameState.difficulty = document.getElementById('difficulty').value;
    resetGame();
}

// Undo move
function undoMove() {
    if (gameState.history.length === 0) return;
    
    const previousState = gameState.history.pop();
    gameState.flipped = previousState.flipped;
    gameState.matched = previousState.matched;
    gameState.moves = previousState.moves;
    gameState.score = previousState.score;
    
    document.getElementById('moves').textContent = gameState.moves;
    document.getElementById('score').textContent = gameState.score;
    renderBoard();
}

// Update best score display
function updateBestScore() {
    document.getElementById('best-score').textContent = gameState.bestScore;
}