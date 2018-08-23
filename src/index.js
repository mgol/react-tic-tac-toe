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
            return squares[a];
        }
    }
};

const Square = props => (
    <button
        className="square"
        onClick={props.onClick}>
        {props.value}
    </button>
);

class Board extends React.PureComponent {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}/>
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.PureComponent {
    state = {
        moves: [],
        stepNumber: 0,
    };

    getPlayer({stepNumber = this.state.stepNumber} = {}) {
        return stepNumber % 2 === 0 ? 'X' : 'O';
    }

    getSquares() {
        return this.state.moves
            .reduce((squares, move, stepNumber) => {
                if (stepNumber < this.state.stepNumber) {
                    squares[move] = this.getPlayer({stepNumber});
                }
                return squares;
            }, Array(9).fill(null));
    }

    handleClick(i) {
        const squares = this.getSquares();
        if (squares[i] || calculateWinner(squares)) {
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
    }

    goToStep(stepNumber) {
        this.setState({
            stepNumber,
        })
    }

    render() {
        const moves = this.state.moves;
        const squares = this.getSquares();
        const winner = calculateWinner(squares);
        const player = this.getPlayer();

        let status;
        if (winner) {
            status = `Winner: ${ winner }`;
        } else if (squares.every(square => square)) {
            status = 'Draw';
        } else {
            status = `Next player: ${ player }`;
        }

        const history = [...moves, null]
            .map((move, step) => {
                const desc = step ? `Go to step #${ step }` : 'Start again';
                return (
                    <li key={step}>
                        <button
                            onClick={() => this.goToStep(step)}
                        >{desc}</button>
                    </li>
                );
            });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{history}</ol>
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
