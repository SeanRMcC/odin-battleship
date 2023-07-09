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
        cell.select();
    }

    function allShipsDown(){
        return ships.every(ship => ship.isSunk());
    }

    return {board, placeShip, isValidPlacement, receiveAttack, allShipsDown};
}