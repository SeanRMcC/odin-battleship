import {Ship} from "./battleship.js";

describe("Battlehsip factory function", () => {
    
    const s = Ship(5);
    
    test("Get Length", () => {
        expect(s.getLength()).toBe(5);
    });
    test("Get Num Hit", () => {
        expect(s.getNumHit()).toBe(0);
    });
    test("Hit Function", () => {
        s.hit();
        expect(s.getNumHit()).toBe(1);
    });
    test("Is Sunk False", () => {
        expect(s.isSunk()).toBe(false);
    });
    test("Is Sunk True", () => {
        s.hit(); s.hit(); s.hit(); s.hit();
        expect(s.isSunk()).toBe(true);
    });
});