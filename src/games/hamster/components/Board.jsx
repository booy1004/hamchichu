import Cell from './Cell';

export default function Board({ board, rows, cols, onClick, onRightClick, onDoubleClick, gameState }) {
  // 모바일에서 보드가 화면에 맞도록 셀 크기 동적 계산
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
  let cellSize = null;
  if (isMobile && cols > 9) {
    const available = window.innerWidth - 56; // padding + border 여유
    const gap = 2;
    const size = Math.floor((available - gap * (cols - 1)) / cols);
    cellSize = Math.max(18, Math.min(24, size));
  }

  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        ...(cellSize ? { '--cell-size': `${cellSize}px` } : {}),
      }}
    >
      {board.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            cell={cell}
            row={r}
            col={c}
            onClick={onClick}
            onRightClick={onRightClick}
            onDoubleClick={onDoubleClick}
            gameState={gameState}
          />
        ))
      )}
    </div>
  );
}
