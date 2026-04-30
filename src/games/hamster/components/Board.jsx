import { useRef, useLayoutEffect, useState as useStateLocal } from 'react';
import Cell from './Cell';

export default function Board({ board, rows, cols, onClick, onRightClick, onDoubleClick, gameState }) {
  const wrapperRef = useRef(null);
  const [cellPx, setCellPx] = useStateLocal(null);

  useLayoutEffect(() => {
    const calc = () => {
      if (!wrapperRef.current) return;
      const wrapperWidth = wrapperRef.current.clientWidth;
      const gap = 2;
      const defaultSize = window.innerWidth <= 600 ? 24 : 36;
      const needed = defaultSize * cols + gap * (cols - 1);
      if (needed > wrapperWidth) {
        const fitted = Math.floor((wrapperWidth - gap * (cols - 1)) / cols);
        setCellPx(Math.max(14, fitted));
      } else {
        setCellPx(null);
      }
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [cols]);

  const size = cellPx || (typeof window !== 'undefined' && window.innerWidth <= 600 ? 24 : 36);

  return (
    <div ref={wrapperRef} className="board-scale-wrapper">
      <div
        className="board"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${size}px)`,
          gridTemplateRows: `repeat(${rows}, ${size}px)`,
          ...(cellPx ? { '--cell-size': `${cellPx}px` } : {}),
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
    </div>
  );
}
