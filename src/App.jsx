import { useState, useCallback } from 'react';
import useGameLogic from './hooks/useGameLogic';
import Board from './components/Board';
import HUD from './components/HUD';
import Hamster from './components/Hamster';
import Overlay from './components/Overlay';
import './game.css';

const DIFFICULTY_LABELS = {
  easy: { label: '쉬움', emoji: '🐣' },
  medium: { label: '보통', emoji: '🐥' },
  hard: { label: '어려움', emoji: '🐔' },
};

export default function App() {
  const [difficulty, setDifficulty] = useState('easy');
  const {
    board, gameState, flagCount, timer, mines, rows, cols,
    lastAction, revealedCount,
    handleClick, handleRightClick, handleDoubleClick, resetGame,
  } = useGameLogic(difficulty);

  const totalSafe = rows * cols - mines;

  const changeDifficulty = useCallback((d) => {
    setDifficulty(d);
  }, []);

  // difficulty 변경 시 리셋
  const handleDifficultyChange = (d) => {
    changeDifficulty(d);
    setTimeout(() => resetGame(d), 0);
  };

  return (
    <div className="app">
      <div className="game-bg" />
      <header className="header">
        <h1 className="title">
          <span className="title-emoji">🐹</span>
          왁왁왁! 치즈 먹방 애햄이
          <span className="title-emoji">🧀</span>
        </h1>
        <p className="subtitle">고양이를 피해 치즈를 먹어라!</p>
      </header>

      <HUD mines={mines} flagCount={flagCount} timer={timer} gameState={gameState} />

      <div className="game-area">
        <div className="hamster-panel">
          <Hamster
            gameState={gameState}
            lastAction={lastAction}
            revealedCount={revealedCount}
            totalSafe={totalSafe}
          />
        </div>
        <div className="board-wrapper">
          <Board
            board={board}
            rows={rows}
            cols={cols}
            onClick={handleClick}
            onRightClick={handleRightClick}
            onDoubleClick={handleDoubleClick}
            gameState={gameState}
          />
        </div>
      </div>

      <div className="controls">
        <button className="btn btn-new" onClick={() => resetGame(difficulty)}>
          🧀 새 게임
        </button>
        <div className="difficulty-selector">
          {Object.entries(DIFFICULTY_LABELS).map(([key, { label, emoji }]) => (
            <button
              key={key}
              className={`btn btn-diff ${difficulty === key ? 'btn-active' : ''}`}
              onClick={() => handleDifficultyChange(key)}
            >
              {emoji} {label}
            </button>
          ))}
        </div>
      </div>

      <div className="help-text">
        <span>🖱️ 좌클릭: 치즈 먹기</span>
        <span>🖱️ 우클릭: 해바라기씨 놓기</span>
        <span>🖱️ 더블클릭: 주변 자동 오픈</span>
      </div>

      <Overlay gameState={gameState} timer={timer} onReset={() => resetGame(difficulty)} />
    </div>
  );
}
