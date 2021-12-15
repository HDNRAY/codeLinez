import { createSlice } from '@reduxjs/toolkit'
import { WritableDraft } from '@reduxjs/toolkit/node_modules/immer/dist/internal';
import { current } from 'immer';
import { Cell, Code, Position, ColorOption } from '../utils/type';
import { generateColors, generatePositions } from '../utils/utils';

interface GameState {
    board: Array<Array<Cell>>;
    rows: number;
    columns: number;
    initialCodes: number;
    colors: Array<ColorOption>;
    nextCodes: Array<Code>;
    selectedCell?: Position;
    gameState: 'initialing' | 'user-action' | 'board-action' | 'over'
}

const initialState = {
    rows: 10,
    columns: 10,
    initialCodes: 4,
    board: [[]],
    selectedCell: undefined,
    colors: [],
    nextCodes: [],
    gameState: 'initialing'
} as GameState

const _updateCell = (state: WritableDraft<GameState>, params: Cell) => {
    const { position, color } = params;
    const target = _getCell(state, position);
    target.state = params.state || target.state;
    target.color = color || target.color;
    return target;
}

const _getCell = (state: WritableDraft<GameState>, position: Position) => {
    const { x, y } = position;
    const target = state.board[y][x];
    return target;
}

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        updateGameState(state, { payload }) {
            state.gameState = payload;
        },
        createGame(state, { payload }) {
            const { rows, columns, initialCodes, colors } = payload;
            state.initialCodes = initialCodes;
            state.rows = rows;
            state.columns = columns;
            state.colors = colors;
            // 初始化棋盘
            state.board = Array.from({ length: rows }).map((_, rIndex) => Array.from({ length: columns }).map((_, cIndex) => {
                return {
                    state: 'empty',
                    color: undefined,
                    position: {
                        x: cIndex,
                        y: rIndex
                    }
                }
            }))
        },
        initializeCodes(state) {
            const initialColors = generateColors(state.colors, state.initialCodes);
            const initialPositions = generatePositions(current(state.board), state.initialCodes);
            initialPositions.forEach((position, index) => {
                _updateCell(state, {
                    position, state: 'set', color: initialColors[index]
                });
            });
        },
        generateNextCodes(state) {
            const nextColors = generateColors(current(state.colors), 3);
            const nextPositions = generatePositions(current(state.board), 3);
            state.nextCodes = nextPositions.map((position, index) => {
                const target = _updateCell(state, {
                    position, state: 'prepared', color: nextColors[index]
                })
                return {
                    ...current(target)
                };
            });
        },
        updateSelectedCell(state, { payload }) {
            state.selectedCell = payload;
        },
        updateCell(state, { payload }) {
            _updateCell(state, payload);
        },
        setPreparedCodes(state) {
            const newPositions = generatePositions(current(state.board), 3);
            state.nextCodes.forEach((code, index) => {
                const { position, color } = code;
                const preparedCell = _getCell(state, position!);
                const _position = !!position && preparedCell.state !== 'set' ? position : newPositions[index];
                if (_position) {
                    _updateCell(state, {
                        position: _position,
                        color: color,
                        state: 'set'
                    });
                }
            })
        },
        mergeCodes(state, { payload }) {
            payload.forEach((line: Array<Position>) => {
                line.forEach((position: Position) => {
                    _updateCell(state, {
                        position,
                        color: undefined,
                        state: 'empty'
                    })
                })
            })
        },
        checkGame(state) {
            const isOver = state.board.every(row => row.every(cell => cell.state === 'set'));
            console.log(isOver);
            state.gameState = isOver ? 'over' : 'user-action';
        }
    },
})

export const { updateGameState, createGame, initializeCodes, generateNextCodes, setPreparedCodes, mergeCodes, checkGame, updateSelectedCell, updateCell } = gameSlice.actions
export default gameSlice.reducer