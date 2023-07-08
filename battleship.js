export function Ship(length){
    const getLength = () => length;

    let numHit = 0;

    const getNumHit = () => numHit;

    const hit = () => numHit++;

    const isSunk = () => numHit >= length;

    return {getLength, getNumHit, hit, isSunk};
}

export function Gameboard(){
    
}