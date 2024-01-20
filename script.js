document.getElementById("startButton").addEventListener("click", function() {
    window.location.href = "/index3.html";
});

const board = document.getElementById("board");
const cells = Array.from({
        length: 9,
    },
    (_, index) => createCell(index)
);

cells.forEach((cell) => board.appendChild(cell));

let currentPlayer = "X";
let winner = null;
let isComputerPlaying = false;

function createCell(index) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = index;
    cell.addEventListener("click", handleCellClick);
    return cell;
}

function handleCellClick(event) {
    if (winner || isComputerPlaying) return;

    const cell = event.target;
    const index = parseInt(cell.dataset.index);

    if (cells[index].textContent !== "") return;

    cells[index].textContent = currentPlayer;

    if (checkWinner()) {
        winner = currentPlayer;
        displayResult(`${winner} wins!`);
    } else if (cells.every((cell) => cell.textContent !== "")) {
        displayResult("It's a draw!");
    } else {
        currentPlayer = currentPlayer === "X" ? "O" : "X";

        if (isComputerPlaying && currentPlayer === "O") {
            playComputerMove();
        }
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // Rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // Columns
        [0, 4, 8],
        [2, 4, 6], // Diagonals
    ];

    return winningCombinations.some((combination) => {
        const [a, b, c] = combination;
        return (
            cells[a].textContent !== "" &&
            cells[a].textContent === cells[b].textContent &&
            cells[a].textContent === cells[c].textContent
        );
    });
}

function displayResult(message) {
    const resultMessage = document.getElementById("result-message");
    resultMessage.textContent = message;

    const modal = document.getElementById("modal");
    modal.style.display = "flex";
}

document
    .getElementById("play-again-button")
    .addEventListener("click", playAgain);
document.getElementById("reset-button").addEventListener("click", resetGame);

function playAgain() {
    cells.forEach((cell) => {
        cell.textContent = "";
    });

    currentPlayer = "X";
    winner = null;

    const modal = document.getElementById("modal");
    modal.style.display = "none";

    if (isComputerPlaying) {
        setTimeout(() => playComputerMove(), 500);
    }
}

function resetGame() {
    playAgain();
    isComputerPlaying = false;
}

// Function to make the computer play a move
function playComputerMove() {
    if (!winner && currentPlayer === "O") {
        const emptyCells = cells.filter((cell) => cell.textContent === "");

        // Check for a winning move
        for (const cell of emptyCells) {
            const originalText = cell.textContent;
            cell.textContent = "O";
            if (checkWinner()) {
                winner = "O";
                displayResult("Computer wins!");
                return;
            }
            cell.textContent = originalText;
        }

        // Check for a blocking move
        for (const cell of emptyCells) {
            const originalText = cell.textContent;
            cell.textContent = "X";
            if (checkWinner()) {
                cell.textContent = "O";
                return;
            }
            cell.textContent = originalText;
        }

        // If no winning or blocking move, play a random move
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const cellToPlay = emptyCells[randomIndex];
        cellToPlay.textContent = "O";

        if (checkWinner()) {
            winner = "O";
            displayResult("Computer wins!");
        }
    }
}

// Uncomment the line below to play against the computer
//  isComputerPlaying = true;
//  playComputerMove();