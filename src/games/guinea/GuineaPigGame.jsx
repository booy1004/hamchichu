import { useEffect } from 'react';
import useAppleLogic from './hooks/useAppleLogic';
import useGuineaRecords from './hooks/useGuineaRecords';
import useSound from './hooks/useSound';
import Board from './components/Board';
import HUD from './components/HUD';
import GuineaPig from './components/GuineaPig';
import Overlay from './components/Overlay';
import Records from './components/Records';
import Challenge from './components/Challenge';
import Legend from './components/Legend';
import './guinea.css';

export default function GuineaPigGame() {
  const {
    board, gameState, score, timeLeft, rows, cols, tapFirst,
    dragStart, dragEnd, getBoxSum, getBoxCells,
    onDragStart, onDragMove, onDragEnd,
    onTapCell, onTapPreview, cancelTap,
    resetGame,
    startWithSeed, generateChallengeCode, parseChallengeCode,
  } = useAppleLogic();

  const { records, addRecord, clearRecords } = useGuineaRecords();
  const { play: playSound } = useSound();

  // 점수 올라가면 소리 재생
  useEffect(() => {
    if (score > 0 && gameState === 'playing') {
      playSound();
    }
  }, [score]);

  const handleSaveRecord = (playerName) => {
    addRecord('easy', score, 0, playerName);
  };

  const handleJoinChallenge = (code) => {
    const parsed = parseChallengeCode(code);
    if (!parsed) return false;
    startWithSeed(parsed.seed);
    return true;
  };

  const boxSum = getBoxSum();
  const boxCells = getBoxCells(dragStart, dragEnd);

  return (
    <div className="gp-app">
      <div className="gp-bg" />
      <header className="gp-header">
        <h1 className="gp-title">
          <span className="gp-title-emoji">🐷</span>
          뿌이뿌이! 파프리카 먹방 사쿠야
          <span className="gp-title-emoji">🫑</span>
        </h1>
        <p className="gp-subtitle">드래그해서 합이 10이 되게 골라 먹어라!</p>
      </header>

      <HUD
        score={score}
        timeLeft={timeLeft}
        gameState={gameState}
        boxSum={boxSum}
        boxCount={boxCells.length}
      />

      <div className="gp-game-area">
        <div className="gp-character-panel">
          <GuineaPig
            gameState={gameState}
            score={score}
            boxSum={boxSum}
            boxCount={boxCells.length}
          />
        </div>
        <div className="gp-board-wrapper">
          <Board
            board={board}
            rows={rows}
            cols={cols}
            dragStart={dragStart}
            dragEnd={dragEnd}
            boxSum={boxSum}
            tapFirst={tapFirst}
            onDragStart={onDragStart}
            onDragMove={onDragMove}
            onDragEnd={onDragEnd}
            onTapCell={onTapCell}
            onTapPreview={onTapPreview}
            cancelTap={cancelTap}
          />
        </div>
      </div>

      <div className="gp-controls">
        <button className="btn gp-btn-new" onClick={resetGame}>
          🫑 새 게임
        </button>
        <Records records={records} onClear={clearRecords} />
        <Challenge onGenerate={generateChallengeCode} onJoin={handleJoinChallenge} />
      </div>

      <Legend />

      <div className="gp-help help-desktop">
        <span>🖱️ 드래그로 사각형 박스를 그려서 합이 10이 되면 사라져요!</span>
      </div>
      <div className="gp-help help-mobile">
        <span>👆 첫 번째 셀 탭 → 두 번째 셀 탭 → 사각형 안의 합이 10이면 사라져요!</span>
      </div>

      <Overlay gameState={gameState} score={score} onReset={resetGame} onSaveRecord={handleSaveRecord} />

      <p className="gp-credits">🔊 Guinea pig sound: RICHERlandTV</p>
    </div>
  );
}
