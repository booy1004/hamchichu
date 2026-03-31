import { useRef, useCallback } from 'react';
import Cell from './Cell';

export default function Board({
  board, rows, cols, dragStart, dragEnd, boxSum, tapFirst,
  onDragStart, onDragMove, onDragEnd,
  onTapCell, onTapPreview,
}) {
  const boardRef = useRef(null);
  const pointerStartCell = useRef(null);
  const lastCell = useRef(null);
  const didDrag = useRef(false);

  const isInBox = useCallback((r, c) => {
    if (!dragStart || !dragEnd) return false;
    const minR = Math.min(dragStart.r, dragEnd.r);
    const maxR = Math.max(dragStart.r, dragEnd.r);
    const minC = Math.min(dragStart.c, dragEnd.c);
    const maxC = Math.max(dragStart.c, dragEnd.c);
    return r >= minR && r <= maxR && c >= minC && c <= maxC && board[r][c].alive;
  }, [dragStart, dragEnd, board]);

  const isMatch = dragStart && dragEnd && boxSum === 10;
  const isTapStart = (r, c) => tapFirst && tapFirst.r === r && tapFirst.c === c;

  const getCellFromPointer = useCallback((clientX, clientY) => {
    if (!boardRef.current) return null;
    const rect = boardRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const gap = 2;
    const cellW = (rect.width - gap * (cols - 1)) / cols;
    const cellH = (rect.height - gap * (rows - 1)) / rows;
    const c = Math.floor(x / (cellW + gap));
    const r = Math.floor(y / (cellH + gap));
    if (r < 0 || r >= rows || c < 0 || c >= cols) return null;
    return { r, c };
  }, [rows, cols]);

  const handleDown = useCallback((clientX, clientY) => {
    const pos = getCellFromPointer(clientX, clientY);
    if (!pos) return;
    pointerStartCell.current = pos;
    lastCell.current = pos;
    didDrag.current = false;

    if (tapFirst) {
      onTapPreview(pos.r, pos.c);
    } else {
      onDragStart(pos.r, pos.c);
    }
  }, [getCellFromPointer, onDragStart, tapFirst, onTapPreview]);

  const handleMove = useCallback((clientX, clientY) => {
    const pos = getCellFromPointer(clientX, clientY);
    if (!pos || !pointerStartCell.current) return;
    lastCell.current = pos;

    if (pos.r !== pointerStartCell.current.r || pos.c !== pointerStartCell.current.c) {
      didDrag.current = true;
    }

    if (tapFirst) {
      onTapPreview(pos.r, pos.c);
    } else {
      onDragMove(pos.r, pos.c);
    }
  }, [getCellFromPointer, onDragMove, tapFirst, onTapPreview]);

  const handleUp = useCallback(() => {
    const pos = lastCell.current || pointerStartCell.current;

    if (tapFirst) {
      if (pos) onTapCell(pos.r, pos.c);
    } else if (!didDrag.current && pos) {
      onTapCell(pos.r, pos.c);
    } else {
      onDragEnd();
    }

    pointerStartCell.current = null;
    lastCell.current = null;
    didDrag.current = false;
  }, [onDragEnd, onTapCell, tapFirst]);

  // 마우스 이벤트 (PC)
  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    handleDown(e.clientX, e.clientY);
  }, [handleDown]);

  const onMouseMove = useCallback((e) => {
    if (!pointerStartCell.current) return;
    e.preventDefault();
    handleMove(e.clientX, e.clientY);
  }, [handleMove]);

  const onMouseUp = useCallback((e) => {
    e.preventDefault();
    handleUp();
  }, [handleUp]);

  // 터치 이벤트 (모바일)
  const onTouchStart = useCallback((e) => {
    e.preventDefault();
    const t = e.touches[0];
    handleDown(t.clientX, t.clientY);
  }, [handleDown]);

  const onTouchMove = useCallback((e) => {
    e.preventDefault();
    const t = e.touches[0];
    handleMove(t.clientX, t.clientY);
  }, [handleMove]);

  const onTouchEnd = useCallback((e) => {
    e.preventDefault();
    handleUp();
  }, [handleUp]);

  return (
    <div
      ref={boardRef}
      className="gp-board"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {board.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            cell={cell}
            isInBox={isInBox(r, c)}
            isMatch={isInBox(r, c) && isMatch}
            isTapStart={isTapStart(r, c)}
          />
        ))
      )}
    </div>
  );
}
