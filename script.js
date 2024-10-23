// declaration

let board = document.getElementById("board");
let prev = document.getElementById("prev");
let next = document.getElementById("next");
let reset = document.getElementById("reset");
let winnerDiv = document.getElementById("winner");

let gameBoard = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

let state = [];
let moves = 0;
let playerTurn1 = true;
let currentStateIndex = -1; // track the current index in the game history

// creating the board
function createBoard() {
    winnerDiv.textContent = 'Current turn: X';
    for (let i = 0; i < 9; i++) {
        let tictactoeGrid = document.createElement("div");
        tictactoeGrid.classList.add("tictactoeBox");
        let gridId = `box${i}`;
        tictactoeGrid.setAttribute("id", gridId);
        board.appendChild(tictactoeGrid);

        tictactoeGrid.addEventListener("click", () => {
            addMove(gridId, i);
        });
    }
}

// adding moves
function addMove(element, boxNumber) {
    moves++;
    let specificGrid = document.getElementById(element);
    // if grid is empty
    if (!specificGrid.textContent) {
        specificGrid.textContent = playerTurn1 ? "X" : "O";
        winnerDiv.textContent = playerTurn1 ? "Current turn: O" : "Current turn: X";
        playerTurn1 = !playerTurn1;
    }

    updateBoard(specificGrid, boxNumber);
}

// updating the board
function updateBoard(element, boxNumber) {
    let row = Math.floor(boxNumber / 3);
    let column = boxNumber % 3;
    gameBoard[row][column] = element.innerText;
    updateState(gameBoard);
}

function updateState(boardCopy) {
    const newBoard = boardCopy.map(row => [...row]);
    if (currentStateIndex < state.length - 1) {
        state = state.slice(0, currentStateIndex + 1);
    }

    state.push(newBoard);
    currentStateIndex++;
    checkEndGame();
}

function reflectBoard(index) {
    let tempBoard = state[index];
    for (let grid = 0; grid < tempBoard.length; grid++) {
        for (let col = 0; col < tempBoard[grid].length; col++) {
            document.getElementById(`box${grid * 3 + col}`).textContent = tempBoard[grid][col];
        }
    }
    gameBoard = tempBoard; // update the gameBoard to the reflected state
}

// end game
function checkEndGame() {
    const winner = getWinner();
    if (winner) {
        displayWinner(winner);
        disableGame();
        enableButtons();
    } else if (isBoardFull()) {
        winnerDiv.textContent = "It's a draw!";
        disableGame();
        enableButtons();
    }
}

function enableButtons() {
    prev.disabled = false;
    next.disabled = false;
}

function isBoardFull() {
    return gameBoard.every(row => row.every(cell => cell !== ''));
}

function displayWinner(winner) {
    winnerDiv.textContent = `The winner is Player: ${winner}!`; 
}

function getWinner() {
    const winningCombinations = [
        [0, 1, 2], // row 
        [3, 4, 5], 
        [6, 7, 8],  
        [0, 3, 6], // column 
        [1, 4, 7], 
        [2, 5, 8], 
        [0, 4, 8], // diagonal 
        [2, 4, 6]  
    ];

    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (gameBoard[Math.floor(a / 3)][a % 3] && 
            gameBoard[Math.floor(a / 3)][a % 3] === gameBoard[Math.floor(b / 3)][b % 3] &&
            gameBoard[Math.floor(a / 3)][a % 3] === gameBoard[Math.floor(c / 3)][c % 3]) {
            highlightWinningCombination(combo);
            return gameBoard[Math.floor(a / 3)][a % 3]; 
        }
    }
    return null;
}

function highlightWinningCombination(combo) {
    combo.forEach(index => {
        document.getElementById(`box${index}`).classList.add('winner');
    });
}

// game over
function disableGame() {
    Array.from(board.children).forEach(cell => {
        cell.style.pointerEvents = 'none'; 
        cell.classList.add('disabled'); 
    });
}

// restart game
reset.addEventListener("click", () => {
    resetGame();
});

function resetGame() {
    gameBoard = [['', '', ''], ['', '', ''], ['', '', '']];
    state = [];
    moves = 0;
    playerTurn1 = true;
    currentStateIndex = -1;

    Array.from(board.children).forEach(cell => {
        cell.textContent = ''; 
        cell.classList.remove('winner'); 
        cell.classList.remove('disabled'); 
    });

    winnerDiv.textContent = 'Current turn: X';
    enableGame();
    prev.disabled = true; 
    next.disabled = true;
}

function enableGame() {
    Array.from(board.children).forEach(cell => {
        cell.style.pointerEvents = 'auto'; // to re-enable cell clicks
    });
}

// prev button
prev.addEventListener("click", () => {
    if (currentStateIndex > 0) {
        currentStateIndex--;
        reflectBoard(currentStateIndex);
        playerTurn1 = !playerTurn1;
    }
});

// next button
next.addEventListener("click", () => {
    if (currentStateIndex < state.length - 1) {
        currentStateIndex++; 
        reflectBoard(currentStateIndex);
        playerTurn1 = !playerTurn1;
    }  
        
});

createBoard();
