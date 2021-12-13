import { createSlice } from '@reduxjs/toolkit'
import { Cell, Position } from '../utils/type';

interface GameState {
    board?: Array<Array<Cell>>;
    nextCodes: Array<Array<Cell>>;
    selectedCode?: Position;
    gameState: 'initialing' | 'user-action' | 'board-action' | 'over'
}

const initialState = {
    board: undefined,
    selectedCode: undefined,
    nextCodes: [],
    gameState: 'initialing'
} as GameState

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        createGame(state, { payload }) {
            const { rows, columns, initialCodes } = payload;
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
            // 生成预备棋子
            state.gameState = 'user-action';
        },
        userMove(state, { payload }) {
            // 检查是否可移动
            // 如果可以，则移动
            // 不可以，则消除选中
        },
        boardMove(state, { payload }) {
            // 检查消除
            // 执行消除
            // 实装预备棋子
            // 生成预备棋子
            // 检查游戏是否结束
        },
        overGame(state, { payload }) {
            // 弹窗
            state.gameState = 'over';
        },
    },
})

export const { createGame, userMove, boardMove, overGame } = gameSlice.actions
export default gameSlice.reducer