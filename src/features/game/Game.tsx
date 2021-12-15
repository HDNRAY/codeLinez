
import { useCallback, useEffect, useMemo, MouseEvent, useState } from 'react';
import { Keyframes } from '../../components/keyframes/Keyframes';
import { setPreparedCodes, createGame, updateCell, updateGameState, updateSelectedCell, initializeCodes, generateNextCodes, mergeCodes, checkGame } from '../../redux/game';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { AllColors, ColorMap, Colors } from '../../utils/constants';
import { Cell, Position } from '../../utils/type';
import { checkLines, comparePositions, findPath } from '../../utils/utils';
import './Game.scss';

const Game = (props: {
    rows?: number,
    columns?: number,
    colors?: Array<Colors>
}) => {
    const dispatch = useAppDispatch();

    const { rows = 9, columns = 9, colors = AllColors } = props;

    const selectedGameState = useAppSelector(state => state.game.gameState);
    const selectedBoard = useAppSelector(state => state.game.board);
    const selectedNextCodes = useAppSelector(state => state.game.nextCodes);
    const selectedCell = useAppSelector(state => state.game.selectedCell);

    const [frames, setFrames] = useState<{
        [key: string]: React.CSSProperties | string
    }>();

    // 状态
    useEffect(() => {
        switch (selectedGameState) {
            case 'initialing':
                dispatch(createGame({
                    rows, columns, initialCodes: 76, colors
                }));
                // 生成初始棋子
                dispatch(initializeCodes());
                // 生成预备棋子
                dispatch(generateNextCodes());
                dispatch(updateGameState('user-action'));
                break;
            case 'user-action':
                break;
            case 'board-action':
                // 实装预备棋子
                dispatch(setPreparedCodes());
                // 生成预备棋子
                dispatch(generateNextCodes());
                break;
            default:
                break;
        }
    }, [colors, columns, dispatch, rows, selectedBoard, selectedGameState])

    useEffect(() => {
        // 检查消除
        const lines = checkLines(selectedBoard!, 4);
        if (lines.length) {
            // 执行消除
            dispatch(mergeCodes(lines));
        }

        // 检查游戏是否结束
        dispatch(checkGame());
    }, [dispatch, selectedBoard])

    const nextCodes = useMemo(() => {
        return <div className='next-codes-wrapper'>
            {selectedNextCodes.map((code, index) => {
                const { color } = code;
                return <div key={index} className='next-code-wrapper'>
                    <div className='code' style={{ backgroundColor: color ? ColorMap[color] : 'transparent' }}></div>
                </div>
            })}
        </div>
    }, [selectedNextCodes]);

    const codeMoveAnimation = useCallback((path: Array<Position>, color: Colors) => {
        setFrames({});
    }, []);

    const userMove = useCallback((position: Position) => {
        // 检查是否可移动
        const path = findPath({
            ...selectedCell!
        }, position, (p: Position) => {
            const { x, y } = p;
            return y > columns - 1 || x > rows - 1 || selectedBoard![y][x].state === 'set';
        });
        if (path) {
            const color = selectedBoard![path[0].y][path[0].x].color;
            dispatch(updateGameState('user-action-moving'));
            // 如果可以，则移动
            codeMoveAnimation([], color);
            dispatch(updateCell({
                position: path[path.length - 1],
                state: 'set',
                color: color
            }));
            dispatch(updateCell({
                position: path[0],
                state: 'empty',
            }));
            dispatch(updateGameState('board-action'))
        }
        // 消除选中
        dispatch(updateSelectedCell(undefined));
    }, [codeMoveAnimation, columns, dispatch, rows, selectedBoard, selectedCell]);

    const onCellClick = useCallback((cell: Cell) => {
        const { position, state } = cell;
        if ((!selectedCell && state === 'set') || !!selectedCell) {
            if (selectedCell) {
                userMove(position);
            } else {
                dispatch(updateSelectedCell(position));
            }
        }
    }, [dispatch, selectedCell, userMove]);

    const onMaskClick = useCallback((event: MouseEvent<HTMLDivElement>) => {
        if (selectedGameState !== 'user-action') {
            event.stopPropagation();
        }
    }, [selectedGameState]);

    const restartGame = useCallback(() => {
        dispatch(updateGameState('initialing'))
    }, [dispatch]);

    const board = useMemo(() => {
        return <div className='board' >
            {selectedBoard?.map((row, rowIndex) => {
                return <div key={`row${rowIndex}`} className='row'>
                    {row.map((cell) => {
                        const { position, state, color } = cell;
                        const { x, y } = position;
                        return <div key={`cell${x}${y}`} className={`cell ${comparePositions(position, selectedCell) ? 'selected' : ''}`} onClick={() => onCellClick(cell)}>
                            {state !== 'empty'
                                ? <div className={`code ${state}`} style={{ backgroundColor: color ? ColorMap[color] : 'transparent' }}></div>
                                : null}
                        </div>
                    })}
                </div>
            })}
        </div>
    }, [onCellClick, selectedBoard, selectedCell])

    return <div className="game-wrapper">
        <div className='user-interaction-mask' onClick={onMaskClick}></div>
        {selectedGameState === 'over' ? <div className='game-result'>
            <div>GAME OVER</div>
            <div>
                <button onClick={restartGame}>再来一局</button>
            </div>
        </div> : null}
        <div className='left-panel'>
            {nextCodes}
        </div>
        {board}
        <div className='right-panel'>
            {/* {selectedGameState} */}
        </div>
        {frames ? <Keyframes name="code-moving-animation" {...frames}></Keyframes> : null}
    </div>
}

export default Game;