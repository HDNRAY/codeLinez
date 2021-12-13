
import { useEffect } from 'react';
import game, { createGame } from '../../redux/game';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { Colors } from '../../utils/constants';
import './Game.scss';

const Game = (props: {
    rows?: number,
    columns?: number,
    colors?: Array<Colors>
}) => {
    const dispatch = useAppDispatch();

    const { rows = 10, columns = 10, colors = [] } = props;

    const selectedGameState = useAppSelector(state => state.game.gameState);
    const selectedBoard = useAppSelector(state => state.game.board);

    useEffect(() => {
        dispatch(createGame({
            rows, columns, initialCodes: 4
        }));
    }, []);
    console.log(selectedBoard)
    return <div className="game-wrapper">
        <div></div>
        <div className='board' >
            {selectedBoard?.map((row, rowIndex) => {
                return <div key={`row${rowIndex}`} className='row'>
                    {row.map((cell) => {
                        const { position } = cell;
                        const { x, y } = position;
                        return <div key={`cell${x}${y}`} className={`cell`}>
                            {x}{y}
                        </div>
                    })}
                </div>
            })}
        </div>
        <div></div>
    </div>
}

export default Game;