import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const calculateWinner = squares => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (const line of lines) {
        const [a, b, c] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                winningSquares: new Set(line),
            };
        }
    }

    return {winner: null, winningSquares: new Set()};
};

const getRowCol = move => ({
    col: move % 3,
    row: Math.floor(move / 3),
});

const Square = props => (
    <button
        className={`square ${ props.highlighted ? 'square-highlighted' : '' }`}
        onClick={props.onClick}>
        {props.value}
    </button>
);

const Board = props => (
    <>{
        [0, 1, 2].map(row =>
            <div key={row}
                 className="board-row">{
                [0, 1, 2].map(col => {
                    const squareNo = 3 * row + col;
                    return (
                        <Square
                            key={col}
                            value={props.squares[squareNo]}
                            highlighted={props.winningSquares.has(squareNo)}
                            onClick={() => props.onClick(squareNo)}/>
                    );
                })
            }</div>,
        )
    }</>
);

class Game extends React.PureComponent {
    state = {
        moves: [],
        stepNumber: 0,
        newestStepsOnBottom: true,
    };

    getPlayer = ({stepNumber = this.state.stepNumber} = {}) => {
        return stepNumber % 2 === 0 ? 'X' : 'O';
    };

    getSquares = () => {
        return this.state.moves
            .reduce((squares, move, stepNumber) => {
                if (stepNumber < this.state.stepNumber) {
                    squares[move] = this.getPlayer({stepNumber});
                }
                return squares;
            }, Array(9).fill(null));
    };

    handleClick = (i) => {
        const squares = this.getSquares();
        if (squares[i] || calculateWinner(squares).winner) {
            return;
        }

        const {stepNumber} = this.state;
        const moves = this.state.moves.slice(0, stepNumber);

        this.setState({
            moves: [
                ...moves,
                i,
            ],
            stepNumber: stepNumber + 1,
        });
    };

    goToStep = stepNumber => {
        this.setState({
            stepNumber,
        });
    };

    toggleStepsOrder = () => {
        this.setState(({newestStepsOnBottom}) => ({
            newestStepsOnBottom: !newestStepsOnBottom,
        }));
    };

    render() {
        const {moves, stepNumber, newestStepsOnBottom} = this.state;
        const squares = this.getSquares();
        const {winner, winningSquares} = calculateWinner(squares);
        const player = this.getPlayer();

        let status;
        if (winner) {
            status = `Winner: ${ winner }`;
        } else if (squares.every(square => square)) {
            status = 'Draw';
        } else {
            status = `Next player: ${ player }`;
        }

        let history = [...moves, null]
            .map((move, step) => {
                const desc = step ? `Go to step #${ step }` : 'Start again';
                const stepPlayer = this.getPlayer({stepNumber: step});
                const {row, col} = move == null ? {} : getRowCol(move);
                return (
                    <li key={step}>
                        <button
                            className={`step-button ${ step === stepNumber ? 'current-step-button' : '' }`}
                            onClick={() => this.goToStep(step)}
                        >{desc}</button>
                        {move == null ? '' : <span>({col + 1}, {row + 1}) player: {stepPlayer}</span>}
                    </li>
                );
            });

        if (!newestStepsOnBottom) {
            history = history.reverse();
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={squares}
                        winningSquares={winningSquares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>
                        {status}
                        <button
                            className="steps-order-toggle"
                            onClick={this.toggleStepsOrder}
                        >Toggle steps order
                        </button>
                    </div>
                    <ol reversed={newestStepsOnBottom ? undefined : 'reversed'}>{history}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root'),
);
