import { useRef, useCallback } from 'react';
import Cell from './Cell';

export default function Board({
  board, rows, cols, dragStart, dragEnd, boxSum, tapFirst,
  onDragStart, onDragMove, onDragEnd,
  onTapCell, onTapPreview,
}) {
  const boardRef = useRef(null);
  const pointerStartCell = useRef(null);
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

  const getCellFromEvent = useCallback((e) => {
    if (!boardRef.current) return null;
    const rect = boardRef.current.getBoundingClientRect();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY;
    if (clientX == null || clientY == null) return null;
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

  // 통합 포인터 핸들러
  const handlePointerDown = useCallback((e) => {
    e.preventDefault();
    const pos = getCellFromEvent(e);
    if (!pos) return;
    pointerStartCell.current = pos;
    didDrag.current = false;

    // 탭 모드에서 첫 셀이 이미 선택된 상태면 프리뷰 시작
    if (tapFirst) {
      onTapPreview(pos.r, pos.c);
    } else {
      // 드래그 시작 (PC) 또는 첫 탭 준비
      onDragStart(pos.r, pos.c);
    }
  }, [getCellFromEvent, onDragStart, tapFirst, onTapPreview]);

  const handlePointerMove = useCallback((e) => {
    e.preventDefault();
    const pos = getCellFromEvent(e);
    if (!pos || !pointerStartCell.current) return;

    // 시작 셀과 다른 셀로 이동했으면 드래그 중
    if (pos.r !== pointerStartCell.current.r || pos.c !== pointerStartCell.current.c) {
      didDrag.current = true;
    }

    if (tapFirst) {
      // 탭 모드: 프리뷰 업데이트
      onTapPreview(pos.r, pos.c);
    } else {
      // 드래그 모드
      onDragMove(pos.r, pos.c);
    }
  }, [getCellFromEvent, onDragMove, tapFirst, onTapPreview]);

  const handlePointerUp = useCallback((e) => {
    e.preventDefault();
    const pos = getCellFromEvent(e);

    if (tapFirst) {
      // 탭 모드: 두 번째 셀 확정
      const target = pos || (dragEnd ? { r: dragEnd.r, c: dragEnd.c } : null);
      if (target) {
        onTapCell(target.r, target.c);
      }
    } else if (!didDrag.current && pos) {
      // 클릭(드래그 안 함) → 탭 모드 시작
      // dragStart/dragEnd 정리하고 탭으로 전환
      onTapCell(pos.r, pos.c);
    } else {
      // 실제 드래그 → 드래그 끝
      onDragEnd();
    }

    pointerStartCell.current = null;
    didDrag.current = false;
  }, [getCellFromEvent, onDragEnd, onTapCell, tapFirst, dragEnd]);

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
      onPointerLeave={(e) => {
        // 드래그 모드에서만 leave 시 끝내기
        if (!tapFirst && pointerStartCell.current) {
          handlePointerUp(e);
        }
      }}
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
