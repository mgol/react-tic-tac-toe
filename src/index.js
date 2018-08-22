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

class Board extends React.Component {
    state = {
        squares: Array(9).fill(null),
        xIsNext: true,
    };

    handleClick(i) {
        if (this.state.squares[i] || calculateWinner(this.state.squares)) {
            return;
        }

        const squares = [...this.state.squares];
        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState(prevState => ({
            squares,
            xIsNext: !prevState.xIsNext,
        }));
    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}/>
        );
    }

    render() {
        const {squares, xIsNext} = this.state;

        const winner = calculateWinner(squares);

        let status;
        if (winner) {
            status = `Winner: ${ winner }`;
        } else if (squares.every(square => square)) {
            status = 'Draw';
        } else {
            status = `Next player: ${ xIsNext ? 'X' : 'O' }`;
        }

        return (
            <div>
                <div className="status">{status}</div>
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

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board/>
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
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
