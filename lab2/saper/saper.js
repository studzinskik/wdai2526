const rows = 8;
const cols = 8;
const minesCount = 10;

let board = [];
let firstClick = true;
let gameOver = false;

const boardEl = document.getElementById("board");
boardEl.style.gridTemplateColumns = `repeat(${cols}, 40px)`;

function initBoard() {
    boardEl.innerHTML = "";

    board = [];
    firstClick = true;

    for (let r = 0; r < rows; r++) {
        const row = [];

        for (let c = 0; c < cols; c++) {
            const cell = document.createElement("div");

            cell.classList.add("cell");
            cell.dataset.row = r;
            cell.dataset.col = c;

            cell.addEventListener("click", clickCell);
            cell.addEventListener("contextmenu", toggleFlag);

            boardEl.appendChild(cell);
            row.push({el: cell, mine: false, revealed: false, neighborMines: 0, flagged: false});
        }

        board.push(row);
    }
}

function placeMines(excludeRow, excludeCol) {
    let minesPlaced = 0;

    while (minesPlaced < minesCount) {
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);

        if ((board[r][c].mine) || (Math.abs(r - excludeRow) <= 1 && Math.abs(c - excludeCol) <= 1)) {
            continue;
        }

        board[r][c].mine = true;
        minesPlaced++;
    }
}

function calculateNeighborMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c].mine) {
                continue;
            };

            let count = 0;

            for (let dr = -1; dr <= 1; dr++) {
                for (let dc = -1; dc <= 1; dc++) {
                    const nr = r + dr;
                    const nc = c + dc;

                    if ((nr >= 0) && (nr < rows) && (nc >= 0) && (nc < cols) && (board[nr][nc].mine)) {
                        count++;
                    }
                }
            }

            board[r][c].neighborMines = count;
        }
    }
}

function clickCell(_) {
    const r = parseInt(this.dataset.row);
    const c = parseInt(this.dataset.col);
    const cell = board[r][c];

    if (cell.revealed || cell.flagged) {
        return;
    }

    if (firstClick) {
        firstClick = false;

        placeMines(r, c);
        calculateNeighborMines();
        revealSafeArea(r, c);

        return;
    }

    revealCell(cell);

    checkWin();
}

function revealCell(cell) {
    if (cell.revealed || cell.flagged) {
        return;
    }

    cell.revealed = true;
    cell.el.classList.add("revealed");

    if (cell.mine) {
        cell.el.classList.add("mine-exploded");
        cell.el.textContent = "💣";

        gameOver = true;

        revealAll();

        return;
    }

    if (cell.neighborMines > 0) {
        cell.el.textContent = cell.neighborMines;
    } else {
        const r = parseInt(cell.el.dataset.row);
        const c = parseInt(cell.el.dataset.col);

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                const nr = r + dr;
                const nc = c + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
                    revealCell(board[nr][nc]);
                }
            }
        }
    }
}

function revealSafeArea(r, c) {
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            const nr = r + dr;
            const nc = c + dc;

            if ((nr >= 0) && (nr < rows) && (nc >= 0) && (nc < cols)) {
                revealCell(board[nr][nc]);
            }
        }
    }
}

function toggleFlag(e) {
    e.preventDefault();

    const r = parseInt(this.dataset.row);
    const c = parseInt(this.dataset.col);
    const cell = board[r][c];

    if (cell.revealed || firstClick) {
        return;
    }

    cell.flagged = !cell.flagged;
    
    if (cell.flagged) {
        cell.el.classList.add("flag");
        cell.el.textContent = "🚩";
    } else {
        cell.el.classList.remove("flag");
        cell.el.textContent = "";
    }
}

function revealAll(win) {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = board[r][c];
            if (cell.mine) {
                cell.el.classList.add("revealed");

                if (cell.flagged) {
                    cell.el.classList.remove("flag");
                    cell.el.classList.add("mine-defused")
                } else if (!cell.el.classList.contains("mine-exploded")) {
                    cell.el.classList.add("mine-uncovered")
                }

                cell.el.textContent = "💣";
            }
        }
    }
}

function checkWin() {
    let won = true;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cell = board[r][c];

            if (!cell.flagged && !cell.mine && !cell.revealed) {
                won = false;
            }
        }
    }

    if (won) {
        gameOver = true;

        revealAll(true);
    }
}

function debugBoard() {
    console.clear();
    for (let r = 0; r < rows; r++) {
        let rowStr = "";
        for (let c = 0; c < cols; c++) {
            const cell = board[r][c];
            if (cell.mine) {
                rowStr += ". ";
            } else {
                rowStr += cell.neighborMines + " ";
            }
        }
        console.log(rowStr);
    }
}

document.getElementById("restart").addEventListener("click", initBoard);

initBoard();
