import { useState, useCallback, useEffect } from 'react';
import useGameLogic from './hooks/useGameLogic';
import useRecords from './hooks/useRecords';
import Board from './components/Board';
import HUD from './components/HUD';
import Hamster from './components/Hamster';
import Overlay from './components/Overlay';
import Records from './components/Records';
import Challenge from './components/Challenge';
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
    startWithSeed, generateChallengeCode, parseChallengeCode,
  } = useGameLogic(difficulty);

  const { records, addRecord, clearRecords } = useRecords();
  const totalSafe = rows * cols - mines;

  // 클리어 시 기록 저장
  useEffect(() => {
    if (gameState === 'won') {
      addRecord(difficulty, timer);
    }
  }, [gameState]);

  const handleDifficultyChange = (d) => {
    setDifficulty(d);
    setTimeout(() => resetGame(d), 0);
  };

  const handleGenerateChallenge = () => {
    return generateChallengeCode();
  };

  const handleJoinChallenge = (code) => {
    const parsed = parseChallengeCode(code);
    if (!parsed) return false;
    setDifficulty(parsed.difficulty);
    setTimeout(() => startWithSeed(parsed.seed, parsed.difficulty), 0);
    return true;
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
        <Records records={records} onClear={clearRecords} />
        <Challenge onGenerate={handleGenerateChallenge} onJoin={handleJoinChallenge} />
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
