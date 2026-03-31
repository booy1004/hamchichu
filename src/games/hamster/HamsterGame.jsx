import { useState, useEffect, useRef } from 'react';
import useGameLogic from './hooks/useGameLogic';
import useRecords from './hooks/useRecords';
import useSound from './hooks/useSound';
import Board from './components/Board';
import HUD from './components/HUD';
import Hamster from './components/Hamster';
import Overlay from './components/Overlay';
import Records from './components/Records';
import Challenge from './components/Challenge';
import './hamster.css';

const DIFFICULTY_LABELS = {
  easy: { label: '쉬움', emoji: '🐣' },
  medium: { label: '보통', emoji: '🐥' },
  hard: { label: '어려움', emoji: '🐔' },
};

export default function HamsterGame() {
  const [difficulty, setDifficulty] = useState('easy');
  const {
    board, gameState, flagCount, timer, mines, rows, cols,
    lastAction, revealedCount,
    handleClick, handleRightClick, handleDoubleClick, resetGame,
    startWithSeed, generateChallengeCode, parseChallengeCode,
  } = useGameLogic(difficulty);

  const { records, addRecord, clearRecords } = useRecords();
  const sound = useSound();
  const totalSafe = rows * cols - mines;
  const prevGameState = useRef(gameState);
  const prevAction = useRef(null);

  // 게임 상태 변화에 따른 사운드
  useEffect(() => {
    if (gameState === 'won' && prevGameState.current !== 'won') {
      sound.playClear();
    }
    if (gameState === 'lost' && prevGameState.current !== 'lost') {
      sound.playCat();
      setTimeout(() => sound.playShock(), 300);
    }
    prevGameState.current = gameState;
  }, [gameState]);

  // 오버레이에서 이름 입력 후 기록 저장
  const handleSaveRecord = (name) => {
    addRecord(difficulty, timer, name);
  };

  // 액션에 따른 사운드
  useEffect(() => {
    if (!lastAction || lastAction === prevAction.current) return;
    prevAction.current = lastAction;

    switch (lastAction.type) {
      case 'reveal': sound.playEat(); break;
      case 'flag': sound.playFlag(); break;
      case 'unflag': sound.playUnflag(); break;
      case 'chord': sound.playChord(); break;
    }
  }, [lastAction]);

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
        <button className="btn btn-new" onClick={() => { resetGame(difficulty); sound.playClick(); }}>
          🧀 새 게임
        </button>
        <button className="btn btn-mute" onClick={sound.toggleMute}>
          {sound.muted ? '🔇' : '🔊'}
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

      <div className="help-text help-desktop">
        <span>🖱️ 좌클릭: 치즈 먹기</span>
        <span>🖱️ 우클릭: 해바라기씨 놓기</span>
        <span>🖱️ 더블클릭: 주변 자동 오픈</span>
      </div>
      <div className="help-text help-mobile">
        <span>👆 탭: 치즈 먹기</span>
        <span>👆 꾹 누르기: 해바라기씨 놓기</span>
        <span>👆 더블탭: 주변 자동 오픈</span>
      </div>

      <Overlay gameState={gameState} timer={timer} onReset={() => resetGame(difficulty)} onSaveRecord={handleSaveRecord} />
    </div>
  );
}
