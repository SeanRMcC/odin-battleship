function Ship(length){
    const getLength = () => length;

    let numHit = 0;

    const getNumHit = () => numHit;

    const hit = () => numHit++;

    const isSunk = () => numHit >= length;

    return {getLength, getNumHit, hit, isSunk};
}

function Gameboard(){
    function Cell(){
        let chosen = false;
        let ship = null;
        const hasBeenChosen = () => chosen;
        const placeShip = incomingShip => {ship = incomingShip};
        const getShip = () => ship;
        const isEmpty = () => !ship;
        const select = () => {
            chosen = true;
            if(!isEmpty()){
                ship.hit();
            }
        };

        return {hasBeenChosen, isEmpty, placeShip, getShip, select};
    }

    const board = [];

    const ships = [];

    for(let r = 0; r < 10; r++){
        const row = [];
        for(let c = 0; c < 10; c++){
            row.push(Cell());
        }
        board.push(row);
    }


    function placeShip(row, col, ship, direction){
        const shipLength = ship.getLength();

        ships.push(ship);

        if(direction == "vertical"){
            for(let r = row; r < shipLength + row; r++){
                board[r][col].placeShip(ship);
            }
        }else if(direction == "horizontal"){
            for(let c = col; c < shipLength + col; c++){
                board[row][c].placeShip(ship);
            }
        }else{
            throw new Error("Direction parameter must be vertical or horizontal");
        }
    }

    function isValidPlacement(row, col, ship, direction){
        const shipLength = ship.getLength();
        
        if(direction == "vertical"){
            if(shipLength + row > 10){
                return false;
            }
            for(let r = row; r < shipLength + row; r++){
                if(!board[r][col].isEmpty()){
                    return false;
                }
            }
            return true;
        }else if(direction == "horizontal"){
            if(shipLength + col > 10){
                return false;
            }
            for(let c = col; c < shipLength + col; c++){
                if(!board[row][c].isEmpty()){
                    return false;
                }
            }
            return true;
        }else{
            throw new Error("Direction parameter must be vertical or horizontal");
        }
    }

    function receiveAttack(row, col){
        const cell = board[row][col];
        if(cell.hasBeenChosen()){
            return false;
        }
        cell.select();
        return true;
    }

    function allShipsDown(){
        return ships.every(ship => ship.isSunk());
    }

    return {board, placeShip, isValidPlacement, receiveAttack, allShipsDown};
}

class Player{
    constructor(){
        this.gameboard = Gameboard();
    }

    getGameboard(){
        return this.gameboard;
    }

    playTurn(row, col, opponent){
        opponent.getGameboard().receiveAttack(row, col);
    }

    win(opponent){
        return opponent.allShipsDown();
    }
}

class AIPlayer extends Player{
    constructor(){
        super();
    }

    playTurn(opponent){
        do{
            const randomRow = parseInt(Math.random() * 10);
            const randomCol = parseInt(Math.random() * 10);
        }while(!opponent.receiveAttack(randomRow, randomCol));
    }
}

function game(){
    const player = new Player();
    const opponent = new AIPlayer();
    populatePlayerCells(player);
    populateAIGrid(opponent);
    AIPlacement(opponent);
    playerPlacementStage(player, opponent);
}

function AIPlacement(opponent){
    const ships = [Ship(5), Ship(4), Ship(3), Ship(3), Ship(2), Ship(2), Ship(2)];
    const directions = ["vertical", "horizontal"];
    const board = opponent.getGameboard();
    while(ships.length !== 0){
        currShip = ships[0];
        const randomRow = parseInt(Math.random() * 10);
        const randomCol = parseInt(Math.random() * 10);
        const randomDirection = directions[parseInt(Math.random() * 2)];
        if(board.isValidPlacement(randomRow, randomCol, currShip, randomDirection)){
            board.placeShip(randomRow, randomCol, currShip, randomDirection);
            ships.shift();
        }
    }
    populateAIGrid(opponent);
}

function populatePlayerCells(player){
    const playerGrid = document.querySelector("#you>.grid");
    playerGrid.innerHTML = "";
    const board = player.getGameboard();
    for(let row = 0; row < 10; row++){
        for(let col = 0; col < 10; col++){
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            const position = board.board[row][col];
            if(position.getShip()){
                cell.classList.add("ship-cell");
                if(position.getShip().isSunk()){
                    cell.classList.add("sunk-ship-cell");
                }
            }
            if(position.hasBeenChosen() && position.getShip()){
                cell.textContent = "💥";
            }else if(position.hasBeenChosen()){
                cell.textContent = "~"
            }
            playerGrid.appendChild(cell);
        }
    }
}

function populateAIGrid(opponent){
    const opponentGrid = document.querySelector("#opponent>.grid");
    opponentGrid.innerHTML = "";
    const board = opponent.getGameboard();
    for(let row = 0; row < 10; row++){
        for(let col = 0; col < 10; col++){
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row;
            cell.dataset.col = col;
            const position = board.board[row][col];
            if(position.getShip()){
                cell.classList.add("ship-cell");
                if(position.getShip().isSunk()){
                    cell.classList.add("sunk-ship-cell");
                }
            }
            if(position.hasBeenChosen() && position.getShip()){
                cell.textContent = "💥";
            }else if(position.hasBeenChosen()){
                cell.textContent = "~"
            }
            opponentGrid.appendChild(cell);
        }
    }
}

function playerPlacementStage(player, opponent){
    const ships = [Ship(5), Ship(4), Ship(3), Ship(3), Ship(2), Ship(2), Ship(2)];
    const board = player.getGameboard();
    const textInput = document.querySelector("#direction");
    const currPlacement = document.querySelector("h3");
    currPlacement.textContent = `Place ship of length ${ships[0].getLength()}`
    function singularPlacement(){
        const cells = document.querySelectorAll("#you>.grid>.cell");
        cells.forEach(cell => {
            cell.addEventListener("click", cellListener.bind(cell));
        
        });
    }
    function cellListener(){
        const r = parseInt(this.dataset.row);
        const c = parseInt(this.dataset.col);
        if(board.isValidPlacement(r, c, ships[0], textInput.value.toLowerCase())){
            board.placeShip(r, c, ships[0], textInput.value.toLowerCase());
            ships.shift();
            populatePlayerCells(player);
            singularPlacement();
        }else{
            console.log("Incorrect")
        }
        if(ships.length === 0){
            console.log("done");
            populatePlayerCells(player);
            playMainGame(player, opponent);
        }else{
            currPlacement.textContent = `Place ship of length ${ships[0].getLength()}`;
        }
    }
    singularPlacement();
        
}

function playMainGame(player, opponent){
    console.log("reached main game");
}

game();