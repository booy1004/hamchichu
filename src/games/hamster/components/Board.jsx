import Cell from './Cell';

export default function Board({ board, rows, cols, onClick, onRightClick, onDoubleClick, gameState }) {
  return (
    <div
      className="board"
      style={{
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
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
