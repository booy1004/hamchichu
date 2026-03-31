import { useRef, useCallback, useState, useEffect } from 'react';
import Cell from './Cell';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia('(hover: none) and (pointer: coarse)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default function Board({
  board, rows, cols, dragStart, dragEnd, boxSum, tapFirst,
  onDragStart, onDragMove, onDragEnd,
  onTapCell, onTapPreview, cancelTap,
}) {
  const boardRef = useRef(null);
  const isMobile = useIsMobile();

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

  // PC: 포인터 이벤트에서 셀 좌표 계산
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

  // PC 드래그 핸들러
  const handlePointerDown = useCallback((e) => {
    if (isMobile) return;
    e.preventDefault();
    const pos = getCellFromEvent(e);
    if (pos) onDragStart(pos.r, pos.c);
  }, [getCellFromEvent, onDragStart, isMobile]);

  const handlePointerMove = useCallback((e) => {
    if (isMobile) return;
    e.preventDefault();
    const pos = getCellFromEvent(e);
    if (pos) onDragMove(pos.r, pos.c);
  }, [getCellFromEvent, onDragMove, isMobile]);

  const handlePointerUp = useCallback((e) => {
    if (isMobile) return;
    e.preventDefault();
    onDragEnd();
  }, [onDragEnd, isMobile]);

  // 모바일 탭 핸들러
  const handleCellTap = useCallback((r, c) => {
    if (!isMobile) return;
    onTapCell(r, c);
  }, [isMobile, onTapCell]);

  // 모바일: 탭 후 다른 셀 위에서 프리뷰
  const handleCellTouchMove = useCallback((e) => {
    if (!isMobile || !tapFirst) return;
    const touch = e.touches[0];
    const pos = getCellFromEvent({ clientX: touch.clientX, clientY: touch.clientY });
    if (pos) onTapPreview(pos.r, pos.c);
  }, [isMobile, tapFirst, getCellFromEvent, onTapPreview]);

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
      onTouchMove={handleCellTouchMove}
    >
      {board.map((row, r) =>
        row.map((cell, c) => (
          <Cell
            key={`${r}-${c}`}
            cell={cell}
            isInBox={isInBox(r, c)}
            isMatch={isInBox(r, c) && isMatch}
            isTapStart={isTapStart(r, c)}
            onTap={() => handleCellTap(r, c)}
          />
        ))
      )}
    </div>
  );
}
