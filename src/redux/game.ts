import { createSlice } from '@reduxjs/toolkit'
import { WritableDraft } from '@reduxjs/toolkit/node_modules/immer/dist/internal';
import { Cell, Code, Position, ColorOption } from '../utils/type';
import { generateColors, generatePositions } from '../utils/utils';

interface GameState {
    board?: Array<Array<Cell>>;
    colors: Array<ColorOption>;
    nextCodes: Array<Code>;
    selectedCell?: Position;
    gameState: 'initialing' | 'user-action' | 'board-action' | 'over'
}

const initialState = {
    board: undefined,
    selectedCell: undefined,
    colors: [],
    nextCodes: [],
    gameState: 'initialing'
} as GameState

const generateNextCodes = (state: WritableDraft<GameState>) => {
    console.log(state.board)
    if (!!state.board) {
        const nextColors = generateColors(state.colors, 3);
        const nextPositions = generatePositions(state.board, 3);
        state.nextCodes = nextPositions.map((position, index) => {
            const { x, y } = position;
            const target = state.board![x][y];
            target.state = 'prepared';
            target.color = nextColors[index];
            return {
                ...target
            };
        });
    }
}

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        createGame(state, { payload }) {
            const { rows, columns, initialCodes, colors } = payload;
            state.colors = colors;
            state.gameState = 'initialing';
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

            // 生成初始棋子
            const initialColors = generateColors(state.colors, initialCodes);
            const initialPositions = generatePositions(state.board, initialCodes);
            initialPositions.forEach((position, index) => {
                const { x, y } = position;
                const target = state.board![x][y];
                target.state = 'set';
                target.color = initialColors[index];
            });

            // 生成预备棋子
            generateNextCodes(state);

            state.gameState = 'user-action';
        },
        userSelect(state, { payload }) {
            state.selectedCell = payload;
        },
        userMove(state, { payload }) {
            // 检查是否可移动
            const path = undefined;
            if (path) {
                // 如果可以，则移动
                gameSlice.actions.boardMove()
            }
            // 消除选中
            state.selectedCell = undefined;
        },
        boardMove(state) {
            state.gameState = 'board-action';
            // 检查消除
            // 执行消除
            // 实装预备棋子
            if (state.board) {
                const newPositions = generatePositions(state.board, 3);
                state.nextCodes.forEach((code, index) => {
                    const { x, y } = newPositions[index];
                    state.board![y][x].state = 'set';
                })
            }

            // 生成预备棋子
            generateNextCodes(state);

            // 检查游戏是否结束
        },
        overGame(state, { payload }) {
            // 弹窗
            state.gameState = 'over';
        },
    },
})

export const { createGame, userMove, boardMove, overGame, userSelect } = gameSlice.actions
export default gameSlice.reducer