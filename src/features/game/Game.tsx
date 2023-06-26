import { useCallback, useEffect, useMemo, useState } from 'react'
import { Keyframes } from '../../components/keyframes/Keyframes'
import {
    setPreparedCodes,
    createGame,
    updateCell,
    updateGameState,
    updateSelectedCell,
    initializeCodes,
    generateNextCodes,
    mergeCodes,
    checkGame,
    finishMovingCode,
} from '../../redux/game'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { AllColors, ColorMap, Colors } from '../../utils/constants'
import { Cell, Position } from '../../utils/type'
import { buildMovingPath, checkLines, comparePositions, findPath, waitForAnimation } from '../../utils/utils'
import './Game.scss'

const getOrientation = () => window?.screen?.orientation?.angle || window.orientation

const Game = (props: { rows?: number; columns?: number; colors?: Array<Colors> }) => {
    const dispatch = useAppDispatch()

    const { rows = 9, columns = 9, colors = AllColors } = props

    const selectedGameState = useAppSelector((state) => state.game.gameState)
    const selectedBoard = useAppSelector((state) => state.game.board)
    const selectedNextCodes = useAppSelector((state) => state.game.nextCodes)
    const selectedCell = useAppSelector((state) => state.game.selectedCell)

    const [deviceOrientation, setDeviceOrientation] = useState(getOrientation() === 0 ? 'portrait' : 'landscape')

    // moving animation
    const [movingColor, setMovingColor] = useState<string>('')
    const [animationFrames, setAnimationFrames] = useState<
        | {
              [key: string]: string
          }
        | undefined
    >()

    useEffect(() => {
        const orientationListener = () => {
            setDeviceOrientation(getOrientation() === 0 ? 'portrait' : 'landscape')
        }
        window.addEventListener('orientationchange', orientationListener)

        return () => window.removeEventListener('orientationchange', orientationListener)
    }, [])

    // 状态
    useEffect(() => {
        console.log(selectedGameState)
        switch (selectedGameState) {
            case 'initialing':
                dispatch(
                    createGame({
                        rows,
                        columns,
                        initialCodes: 4,
                        colors,
                    })
                )
                // 生成初始棋子
                dispatch(initializeCodes())
                // 生成预备棋子
                dispatch(generateNextCodes())
                dispatch(updateGameState('user-action'))
                break
            case 'user-action':
                break
            case 'board-action':
                // 实装预备棋子
                dispatch(setPreparedCodes())
                // 生成预备棋子
                dispatch(generateNextCodes())
                dispatch(updateGameState('user-action'))
                break
            default:
                break
        }
    }, [colors, columns, dispatch, rows, selectedGameState])

    useEffect(() => {
        // 检查消除
        const lines = checkLines(selectedBoard!, 4)
        if (lines.length) {
            // 执行消除
            dispatch(mergeCodes(lines))
        }

        // 检查游戏是否结束
        dispatch(checkGame())
    }, [dispatch, selectedBoard])

    const nextCodes = useMemo(() => {
        return (
            <div className="next-codes-wrapper">
                {selectedNextCodes.map((code, index) => {
                    const { color } = code
                    return (
                        <div key={index} className="next-code-wrapper">
                            <div
                                className="code"
                                style={{
                                    backgroundColor: color ? ColorMap[color] : 'transparent',
                                }}
                            ></div>
                        </div>
                    )
                })}
            </div>
        )
    }, [selectedNextCodes])

    const codeMoveAnimation = useCallback(async (path: Array<Position>, color: Colors) => {
        setMovingColor(ColorMap[color])
        const framePoints = buildMovingPath(path)
        setAnimationFrames(framePoints)
        await waitForAnimation(1000)
        setAnimationFrames(undefined)
    }, [])

    const userMove = useCallback(
        async (position: Position) => {
            // 检查是否可移动
            const path =
                !!selectedCell &&
                findPath(
                    {
                        ...selectedCell,
                    },
                    position,
                    (p: Position) => {
                        const { x, y } = p
                        return y > columns - 1 || x > rows - 1 || selectedBoard![y][x].state === 'set'
                    }
                )
            if (path) {
                const color = selectedBoard![path[0].y][path[0].x].color
                // 如果可以，则移动
                dispatch(
                    updateCell({
                        position: path[0],
                        state: 'empty',
                    })
                )
                await codeMoveAnimation(path, color)
                // merge two action into one to avoid second not working after await
                dispatch(
                    finishMovingCode({
                        position: path[path.length - 1],
                        gameState: 'board-action',
                        color,
                    })
                )
            }
            // 消除选中
            dispatch(updateSelectedCell(undefined))
        },
        [codeMoveAnimation, columns, dispatch, rows, selectedBoard, selectedCell]
    )

    const onCellClick = useCallback(
        (cell: Cell) => {
            const { position, state } = cell
            if ((!selectedCell && state === 'set') || !!selectedCell) {
                if (selectedCell) {
                    userMove(position)
                } else {
                    dispatch(updateSelectedCell(position))
                }
            }
        },
        [dispatch, selectedCell, userMove]
    )

    const restartGame = useCallback(() => {
        dispatch(updateGameState('initialing'))
    }, [dispatch])

    const board = useMemo(() => {
        return (
            <div className="board">
                {selectedBoard?.map((row, rowIndex) => {
                    return (
                        <div key={`row${rowIndex}`} className="row">
                            {row.map((cell) => {
                                const { position, state, color } = cell
                                const { x, y } = position
                                return (
                                    <div
                                        key={`cell${x}${y}`}
                                        className={`cell ${comparePositions(position, selectedCell) ? 'selected' : ''}`}
                                        onClick={() => onCellClick(cell)}
                                    >
                                        {state !== 'empty' ? (
                                            <div
                                                className={`code ${state}`}
                                                style={{
                                                    backgroundColor: color ? ColorMap[color] : 'transparent',
                                                }}
                                            ></div>
                                        ) : null}
                                    </div>
                                )
                            })}
                        </div>
                    )
                })}
                {animationFrames && <Keyframes name="code-moving-animation" {...animationFrames}></Keyframes>}
                {animationFrames && <div className="moving-code" style={{ background: movingColor }}></div>}
            </div>
        )
    }, [selectedBoard, animationFrames, movingColor, selectedCell, onCellClick])

    return (
        <div className={`game-wrapper ${deviceOrientation}`}>
            <div
                className="user-interaction-mask"
                style={{ pointerEvents: selectedGameState === 'user-action' && !animationFrames ? 'none' : 'auto' }}
            ></div>
            {selectedGameState === 'over' ? (
                <div className="game-result">
                    <div>GAME OVER</div>
                    <div>
                        <button onClick={restartGame}>再来一局</button>
                    </div>
                </div>
            ) : null}
            <div className="left-panel">{nextCodes}</div>
            {board}
            <div className="right-panel">{/* {selectedGameState} */}</div>
        </div>
    )
}

export default Game
