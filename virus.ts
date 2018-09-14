class Board {
    numRows: number;
    numCols: number;
    grid: Color[];
    constructor(numRows: number, numCols: number, numColors: number) {
        this.numRows = numRows;
        this.numCols = numCols;
        this.grid = new Array(this.numRows * this.numCols);
        for (let i = 0; i < this.numRows * this.numCols; i++) {
            this.grid[i] = COLORS[Math.floor(numColors * Math.random())];
        }
    }

    cell(i, j): Color {
        return this.grid[this.numCols * i + j];
    }
    private set(i, j, c: Color) {
        this.grid[this.numCols * i + j] = c;
    }

    flood(next: Color) {
        let prev = this.cell(0, 0);
        if (prev != next) {
            this.floodfill(prev, next, 0, 0);
        }
    }

    private floodfill(prev: Color, next: Color, i, j) {
        if (this.cell(i, j) == prev) {
            this.set(i, j, next);
            if (j + 1 < this.numCols) {
                this.floodfill(prev, next, i, j + 1);
            }
            if (i > 0) {
                this.floodfill(prev, next, i - 1, j);
            }
            if (j > 0) {
                this.floodfill(prev, next, i, j - 1);
            }
            if (i + 1 < this.numRows) {
                this.floodfill(prev, next, i + 1, j);
            }
        }
    }
}

interface Color {
    code: string
}
// Taken from https://sashat.me/2017/01/11/list-of-20-simple-distinct-colors/
const COLORS = [
    { code: "#e6194B" },
    { code: "#3cb44b" },
    { code: "#ffe119" },
    { code: "#4363d8" },
    { code: "#f58231" },
    { code: "#911eb4" },
    { code: "#42d4f4" },
    { code: "#f032e6" },
    { code: "#bfef45" },
    { code: "#fabebe" },
    { code: "#469990" },
    { code: "#e6beff" },
    { code: "#9A6324" },
    { code: "#fffac8" },
    { code: "#800000" },
    { code: "#aaffc3" },
    { code: "#808000" },
    { code: "#ffd8b1" },
    { code: "#000075" },
    { code: "#a9a9a9" },
    { code: "#ffffff" },
    { code: "#000000" },
];

type Listener = (i, j) => void;

class View {
    private div: HTMLDivElement;
    listener: (i, j) => void;
    constructor(divId: string, listener: Listener) {
        this.div = document.getElementById(divId) as HTMLDivElement;
        this.listener = listener;
    }
    view(board: Board) {
        this.clear();

        let table = document.createElement("table");
        this.div.appendChild(table);

        for (let i = 0; i < board.numRows; i++) {
            let row = document.createElement("tr");
            table.appendChild(row);
            for (let j = 0; j < board.numCols; j++) {
                let cell = document.createElement("td");
                row.appendChild(cell);

                let button = document.createElement("button");
                cell.appendChild(button);

                button.classList.add("cell");
                button.style["backgroundColor"] = board.cell(i, j).code;
                button.onclick = () => this.listener(i, j);
            }
        }
    }

    private clear() {
        while (this.div.lastChild) {
            this.div.removeChild(this.div.lastChild);
        }
    }
}

window.onload = function() {
    let myBoard = new Board(25, 40, 5);
    let myView = new View("board", (i, j) => {
        myBoard.flood(myBoard.cell(i, j));
        myView.view(myBoard);
    });
    myView.view(myBoard);
};