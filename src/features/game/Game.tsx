
import { useCallback, useEffect, useMemo } from 'react';
import { createGame, userMove, userSelect } from '../../redux/game';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { AllColors, ColorMap, Colors } from '../../utils/constants';
import { Position } from '../../utils/type';
import { comparePositions } from '../../utils/utils';
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

    useEffect(() => {
        dispatch(createGame({
            rows, columns, initialCodes: 4, colors
        }));
    }, [colors, columns, dispatch, rows]);

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

    const onCellClick = useCallback((position: Position) => {
        dispatch(selectedCell ? userMove(position) : userSelect(position))
    }, [dispatch, selectedCell]);

    const board = useMemo(() => {
        return <div className='board' >
            {selectedBoard?.map((row, rowIndex) => {
                return <div key={`row${rowIndex}`} className='row'>
                    {row.map((cell) => {
                        const { position, state, color } = cell;
                        const { x, y } = position;
                        return <div key={`cell${x}${y}`} className={`cell ${comparePositions(position, selectedCell) ? 'selected' : ''}`} onClick={() => onCellClick(position)}>
                            {state === 'set'
                                ? <div className='code' style={{ backgroundColor: color ? ColorMap[color] : 'transparent' }}></div>
                                : null}
                        </div>
                    })}
                </div>
            })}
        </div>
    }, [onCellClick, selectedBoard, selectedCell])

    return <div className="game-wrapper">
        <div className='left-panel'>
            {nextCodes}
        </div>
        {board}
        <div className='right-panel'>
            {selectedGameState}
        </div>
    </div>
}

export default Game;