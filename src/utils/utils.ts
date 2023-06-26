import { Colors } from './constants'
import { Cell, ColorOption, Position } from './type'

const positionUp = (p: Position) => ({
    x: p.x,
    y: p.y - 1,
})

const positionDown = (p: Position) => ({
    x: p.x,
    y: p.y + 1,
})

const positionLeft = (p: Position) => ({
    x: p.x - 1,
    y: p.y,
})

const positionRight = (p: Position) => ({
    x: p.x + 1,
    y: p.y,
})

const randomInRange = (start: number, end: number) => {
    const result = Math.round(Math.random() * (end - start)) + start
    return result
}

const randomsInRange = (start: number, end: number, count: number, repeatable = false) => {
    const result: number[] = []
    while (result.length < count && (repeatable || result.length <= end - start)) {
        const value = randomInRange(start, end)
        if (repeatable || !result.includes(value)) {
            result.push(value)
        }
    }
    return result
}

const generatePositions = (board: Array<Array<Cell>>, count: number) => {
    const availables: Array<Position> = board.flatMap((i) => {
        return i.filter((i) => i.state === 'empty').map((i) => i.position)
    })
    const positions: Array<Position> = randomsInRange(0, availables.length - 1, count).map((i) => availables[i])
    return positions
}

const generateColors = (allColors: Array<ColorOption>, count: number) => {
    const colors: Array<Colors> = randomsInRange(0, allColors.length - 1, count, true).map((i) => allColors[i].value)
    return colors
}

const comparePositions = (p1: Position, p2?: Position) => {
    return !!p1 && !!p2 && (p1 === p2 || (p1.x === p2.x && p1.y === p2.y))
}

const positionToIndex = (p: Position): string => `${p.x}${p.y}`
// 寻路
const findPath = (start: Position, end: Position, disabledCallback: any) => {
    // 记录到每个点的路径
    const pathMap: { [key: string]: Array<Position> } = {}
    let newPoints: Array<Position> = [start]
    // 循环扩张
    while (!(pathMap[positionToIndex(end)] || !newPoints.length)) {
        newPoints = newPoints.flatMap((p) => {
            const previousPath = pathMap[positionToIndex(p)] || [start]
            // 过滤周围可以走的点
            const _newPoints = [positionUp(p), positionDown(p), positionLeft(p), positionRight(p)].filter((i) => {
                return i.x >= 0 && i.y >= 0 && !pathMap[positionToIndex(i)] && !disabledCallback(i)
            })
            _newPoints.forEach((p) => {
                const index = positionToIndex(p)
                pathMap[index] = [...previousPath, p]
            })
            return _newPoints
        })
    }
    return pathMap[positionToIndex(end)]
}

// 检查是否消除
const checkLine = (cell: Cell, rows: number, columns: number, getNext: (position: Position) => Cell) => {
    const { position, color } = cell
    let next = getNext(position)
    const line = [position]
    while (
        next &&
        next.position.x < columns &&
        next.position.y < rows &&
        next.state === 'set' &&
        next.color === color
    ) {
        line.push(next.position)
        next = getNext(next.position)
    }
    return line
}

const checkLines = (board: Array<Array<Cell>>, leastLength: number) => {
    const usedCode: Array<Array<Position>> = [[], [], []]
    const lines: Array<Array<Position>> = []
    board.forEach((row) => {
        // 过滤一下空格
        row.filter((cell) => cell.state === 'set').forEach((cell) => {
            // 横，竖，斜
            const getNexts: Array<any> = [
                (position: Position) => row[position.x + 1],
                (position: Position) => board[position.y + 1]?.[position.x],
                (position: Position) => board[position.y + 1]?.[position.x + 1],
            ]

            getNexts.forEach((getNext, index) => {
                const { position } = cell
                const { x, y } = position
                // 1. 如果某个坐标加上该方向上后面所有的，依旧小于最小消灭长度，则不用算了
                // 2. 如果某个坐标已经在该方向上统计过了，则不用算了
                const noNeed =
                    (x + leastLength > row.length && [0, 2].includes(index)) ||
                    (y + leastLength > board.length && [1, 2].includes(index)) ||
                    usedCode[index].includes(position)
                const line = noNeed ? [] : checkLine(cell, board.length, row.length, getNext)
                // 满足最小长度
                if (line.length >= leastLength) {
                    lines.push(line)
                    // 记录已经统计过的坐标
                    usedCode[index].push(...line)
                }
            })
        })
    })
    return lines
}

// 生成动画路径
const buildMovingPath = (path: Array<Position>) => {
    console.log(path)
    const percentageStep = Math.floor(100 / (path.length - 1))
    const scale = Math.floor((70 * 100) / 9) / 100
    const movingSteps = path.reduce((result: any, point, index) => {
        const percentage = `_${index * percentageStep}`
        result[percentage] = `top:${point.y * scale}vmin; left:${point.x * scale}vmin;`
        return result
    }, {})
    console.log(movingSteps)
    return movingSteps
}

/**
 * wait for animation time
 * @param duration milli-second
 */
const waitForAnimation = (duration: number) => {
    return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), duration)
    })
}

export { generatePositions, generateColors, comparePositions, findPath, checkLines, buildMovingPath, waitForAnimation }
