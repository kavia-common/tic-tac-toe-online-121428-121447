import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * PUBLIC_INTERFACE
 * Main application entrypoint for the Tic Tac Toe frontend.
 * - Centered layout with controls at top, board centered, status/control below.
 * - Modern, light-themed UI using palette: primary #1976d2, secondary #424242, accent #ff4081.
 * - Supports Player vs Player (PvP) and Player vs Computer (PvC) modes.
 */
const BOARD_SIZE = 3;
const MODES = {
  PVP: "Player vs Player",
  PVC: "Player vs Computer"
};
const PLAYER_X = "X";
const PLAYER_O = "O";

// PUBLIC_INTERFACE
function App() {
  // State for theme, game mode, board setup, player turns, etc.
  const [mode, setMode] = useState(MODES.PVP);
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_X);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState("");
  const [isGameActive, setIsGameActive] = useState(true);
  const [moves, setMoves] = useState(0);

  // Reset all relevant states to start a new game
  // PUBLIC_INTERFACE
  function startNewGame(selectedMode = mode) {
    setMode(selectedMode);
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(""));
    setCurrentPlayer(PLAYER_X);
    setWinner(null);
    setMessage("");
    setIsGameActive(true);
    setMoves(0);
  }

  // Handle a player's move
  // PUBLIC_INTERFACE
  function handleCellClick(index) {
    if (!isGameActive || board[index] !== "" || winner) return;
    const updatedBoard = [...board];
    updatedBoard[index] = currentPlayer;
    setBoard(updatedBoard);
    setMoves(moves + 1);
    checkGameStatus(updatedBoard, currentPlayer, moves + 1);
    setCurrentPlayer(currentPlayer === PLAYER_X ? PLAYER_O : PLAYER_X);
  }

  // Logic for computer move (simple: random free cell)
  useEffect(() => {
    if (
      mode === MODES.PVC &&
      currentPlayer === PLAYER_O &&
      isGameActive &&
      !winner
    ) {
      // Timeout for a minimal delay for realism.
      const timer = setTimeout(() => {
        const emptyCells = board
          .map((cell, idx) => (cell === "" ? idx : null))
          .filter((idx) => idx !== null);
        if (emptyCells.length > 0) {
          // Randomly pick a move (can be replaced with smarter AI)
          const randomIdx = emptyCells[Math.floor(Math.random() * emptyCells.length)];
          handleCellClick(randomIdx);
        }
      }, 400);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line
  }, [board, currentPlayer, isGameActive, winner, mode]);

  // Winning logic for Tic Tac Toe
  // PUBLIC_INTERFACE
  function checkGameStatus(boardState, currPlayer, moveCount) {
    const lines = [
      // Rows
      [0,1,2],[3,4,5],[6,7,8],
      // Cols
      [0,3,6],[1,4,7],[2,5,8],
      // Diags
      [0,4,8],[2,4,6]
    ];
    for (const [a, b, c] of lines) {
      if (
        boardState[a] &&
        boardState[a] === boardState[b] &&
        boardState[a] === boardState[c]
      ) {
        setWinner(boardState[a]);
        setIsGameActive(false);
        setMessage(`Player ${boardState[a]} wins! 🎉`);
        return;
      }
    }
    if (moveCount === BOARD_SIZE * BOARD_SIZE) {
      setWinner("draw");
      setIsGameActive(false);
      setMessage("It's a draw! 🤝");
    } else {
      setMessage(
        mode === MODES.PVC && currPlayer === PLAYER_O
          ? "Computer is thinking..."
          : `Player ${currPlayer === PLAYER_X ? PLAYER_O : PLAYER_X}'s turn`
      );
    }
  }

  // Set initial status message on mount and when mode/game restarts
  useEffect(() => {
    if (winner === null) {
      setMessage(`Player ${PLAYER_X}'s turn`);
    }
    // eslint-disable-next-line
  }, [mode, board.length, winner]);

  return (
    <div className="main-bg">
      <div className="ttt-app-container">
        {/* Controls/Header */}
        <header className="ttt-header">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <div className="ttt-controls">
            {/* Mode Selector */}
            <ModeSelector mode={mode} setMode={(m)=>startNewGame(m)} />
            {/* Restart/Start New */}
            <button className="ttt-btn ttt-btn-accent" onClick={() => startNewGame(mode)}>
              Restart Game
            </button>
          </div>
        </header>
        {/* Board */}
        <div className="ttt-board-wrapper">
          <Board
            board={board}
            onCellClick={handleCellClick}
            isGameActive={isGameActive}
            winner={winner}
            mode={mode}
            currentPlayer={currentPlayer}
          />
        </div>
        {/* Status/Message */}
        <div className="ttt-status">
          {message && (
            <span
              className={
                winner === null
                  ? "ttt-message"
                  : winner === "draw"
                  ? "ttt-message draw"
                  : "ttt-message win"
              }
              data-testid="game-status"
            >
              {message}
            </span>
          )}
        </div>
      </div>
      <footer className="ttt-footer">
        <span>
          <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer">
            Built with React
          </a>
        </span>
      </footer>
    </div>
  );
}

// Mode Selector component
// PUBLIC_INTERFACE
function ModeSelector({ mode, setMode }) {
  return (
    <div className="ttt-mode-group">
      <span className="ttt-mode-label">Mode:</span>
      <button
        className={`ttt-btn${mode === MODES.PVP ? " ttt-btn-active" : ""}`}
        onClick={() => setMode(MODES.PVP)}
        aria-pressed={mode === MODES.PVP}
      >
        PvP
      </button>
      <button
        className={`ttt-btn${mode === MODES.PVC ? " ttt-btn-active" : ""}`}
        onClick={() => setMode(MODES.PVC)}
        aria-pressed={mode === MODES.PVC}
      >
        PvC
      </button>
    </div>
  );
}

// Board component
// PUBLIC_INTERFACE
function Board({ board, onCellClick, isGameActive, winner, mode, currentPlayer }) {
  return (
    <div className="ttt-board" data-testid="ttt-board">
      {board.map((cell, idx) => (
        <Cell
          key={idx}
          value={cell}
          onClick={() => {
            // Disable cell clicks if game not active, cell occupied, or CPU turn
            if (
              !isGameActive ||
              !!cell ||
              (mode === MODES.PVC && currentPlayer === PLAYER_O)
            )
              return;
            onCellClick(idx);
          }}
        />
      ))}
    </div>
  );
}

// Cell component
// PUBLIC_INTERFACE
function Cell({ value, onClick }) {
  return (
    <button
      className={`ttt-cell${value ? " filled" : ""}`}
      tabIndex={0}
      onClick={onClick}
      aria-label={value ? `Cell: ${value}` : "Empty cell"}
      data-testid="cell"
    >
      {value}
    </button>
  );
}

export default App;
