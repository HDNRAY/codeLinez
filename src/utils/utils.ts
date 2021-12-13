
import { Colors } from "./constants";
import { Cell, ColorOption, CommonOption, Position } from "./type";

const optionsToMap = (options: Array<CommonOption>) => {

}

const randomInRange = (start: number, end: number) => {
    const result = Math.floor(Math.random() * (end - start) + start);
    return result;
}

const randomsInRange = (start: number, end: number, count: number) => {
    const result: number[] = [];
    while (result.length < count) {
        const value = randomInRange(start, end);
        if (!result.includes(value)) {
            result.push(value);
        }
    }
    return result;
}

const generatePositions = (board: Array<Array<Cell>>, count: number) => {
    const availables: Array<Position> = board.flatMap(i => {
        return i.filter(i => i.state === 'empty').map(i => i.position);
    })
    const positions: Array<Position> = randomsInRange(0, availables.length - 1, count).map(i => availables[i]);
    return positions;
}

const generateColors = (allColors: Array<ColorOption>, count: number) => {
    const colors: Array<Colors> = randomsInRange(0, allColors.length - 1, count).map(i => allColors[i].value);
    return colors;
}

const comparePositions = (p1: Position, p2?: Position) => {
    return !!p1 && !!p2 && (p1 === p2 || (p1.x === p2.x && p1.y === p2.y));
}

export { optionsToMap, generatePositions, generateColors, comparePositions };