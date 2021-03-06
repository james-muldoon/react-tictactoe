import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
            style={props.style}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        const winningSquareStyle = {
            color: 'green',
        }

        return <Square
            style={(this.props.winningSquares && this.props.winningSquares.indexOf(i) !== -1) ? winningSquareStyle : null}
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {
        return (
            <div>
                <div className="status">{this.props.status}</div>
                {
                    [0, 1, 2].map((row) => {
                        return <div key={row} className="board-row">
                            {
                                [0, 1, 2].map((col) => {
                                    return this.renderSquare(row * 3 + col);
                                })
                            }
                        </div>
                    })
                }
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
            sortAsc: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (squares[i] || calculateWinner(squares)) {
            this.setState({
                current: this.state.current
            });
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    getChangedCell(stepNumber) {
        if (stepNumber === 0) {
            return '';
        }
        const history = this.state.history;
        const current = history[stepNumber];
        const prev = history[stepNumber - 1];
        for (var i = 0; i < current.squares.length; i++) {
            if (current.squares[i] !== prev.squares[i]) {
                const col = (i % 3) + 1;
                const row = parseInt(i / 3) + 1;
                return `(${col}, ${row})`;
            }
        }
        return null;
    }

    toggleAsc() {
        this.setState({
            sortAsc: !this.state.sortAsc
        })
    }

    render() {
        // const history = (this.state.sortAsc) ? this.state.history : this.state.history.slice().reverse();
        const history = this.state.history;
        const stepNumber = (this.state.sortAsc) ? this.state.stepNumber : history.length - this.state.stepNumber - 1;
        const current = this.state.history.slice()[stepNumber];

        const moveStyle = {
            fontWeight: 'bold'
        }

        const moves = history.map((step, move) => {
            const currMove = (this.state.sortAsc) ? move : history.length - move - 1;
            const movePosn = this.getChangedCell(currMove);
            const desc = currMove ?
                `Go to move ${movePosn}` :
                // `Go to move ${move}` :
                'Go to game start';
            return (
                <li key={currMove}>
                    <button style={currMove === stepNumber ? moveStyle : null} onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        const winner = calculateWinner(current.squares.slice());
        let status;
        if (winner) {
            status = 'Winner: ' + current.squares[winner[0]];
        } else {
            if (this.state.history[this.state.stepNumber].squares.reduce((acc, val) => acc && val)) {
                status = 'There is no winner!';
            } else {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
        }


        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winningSquares={winner}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button
                        onClick={() => this.toggleAsc()}
                    >
                    {this.state.sortAsc ? 'Ascending' : 'Descending'}
                    </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a, b, c];
        }
    }
    return null;
}


// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
