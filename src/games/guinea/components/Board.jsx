import { useRef, useCallback } from 'react';
import Cell from './Cell';

export default function Board({ board, rows, cols, dragStart, dragEnd, boxSum, onDragStart, onDragMove, onDragEnd }) {
  const boardRef = useRef(null);

  // 셀이 드래그 박스 안에 있는지 체크
  const isInBox = useCallback((r, c) => {
    if (!dragStart || !dragEnd) return false;
    const minR = Math.min(dragStart.r, dragEnd.r);
    const maxR = Math.max(dragStart.r, dragEnd.r);
    const minC = Math.min(dragStart.c, dragEnd.c);
    const maxC = Math.max(dragStart.c, dragEnd.c);
    return r >= minR && r <= maxR && c >= minC && c <= maxC && board[r][c].alive;
  }, [dragStart, dragEnd, board]);

  const isMatch = dragStart && dragEnd && boxSum === 10;

  // 포인터 이벤트에서 셀 좌표 계산
  const getCellFromEvent = useCallback((e) => {
    if (!boardRef.current) return null;
    const rect = boardRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY) - rect.top;
    const gap = 2;
    const cellW = (rect.width - gap * (cols - 1)) / cols;
    const cellH = (rect.height - gap * (rows - 1)) / rows;
    const c = Math.floor(x / (cellW + gap));
    const r = Math.floor(y / (cellH + gap));
    if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
    return { r, c };
  }, [rows, cols]);

  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    const pos = getCellFromEvent(e);
    if (pos) onDragStart(pos.r, pos.c);
  }, [getCellFromEvent, onDragStart]);

  const handlePointerMove = useCallback((e) => {
    e.preventDefault();
    const pos = getCellFromEvent(e);
    if (pos) onDragMove(pos.r, pos.c);
  }, [getCellFromEvent, onDragMove]);

  const handlePointerUp = useCallback((e) => {
    e.preventDefault();
    onDragEnd();
  }, [onDragEnd]);

  return (
    <div
      ref={boardRef}
      className="gp-board"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchMove={(e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const pos = getCellFromEvent({ clientX: touch.clientX, clientY: touch.clientY });
        if (pos) onDragMove(pos.r, pos.c);
      }}
      onTouchEnd={handlePointerUp}
    >
      {board.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            cell={cell}
            isInBox={isInBox(r, c)}
            isMatch={isInBox(r, c) && isMatch}
          />
        ))
      )}
    </div>
  );
}
