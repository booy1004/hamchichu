import { memo } from 'react';

const PAPRIKA_BG = {
  green: '#E8F5E9',
  yellow: '#FFFDE7',
  orange: '#FFF3E0',
  red: '#FFEBEE',
};

const NUMBER_COLORS = {
  1: '#78909C', 2: '#5C6BC0', 3: '#26A69A', 4: '#FFA726',
  5: '#EF5350', 6: '#AB47BC', 7: '#EC407A', 8: '#42A5F5', 9: '#8D6E63',
};

function PaprikaIcon({ type, size = 16 }) {
  const colors = { green: '#4CAF50', yellow: '#FDD835', orange: '#FB8C00', red: '#E53935' };
  const color = colors[type] || '#4CAF50';
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="paprika-icon">
      <path d="M12 2 C11 2, 10 3, 10 4 L14 4 C14 3, 13 2, 12 2Z" fill="#388E3C" />
      <line x1="12" y1="1" x2="12" y2="3" stroke="#2E7D32" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M7 5 C6 5, 5 7, 5 10 C5 16, 8 20, 10 21 C11 21.5, 13 21.5, 14 21 C16 20, 19 16, 19 10 C19 7, 18 5, 17 5Z" fill={color} />
      <path d="M9 7 C8.5 9, 8 12, 9 15" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function CellComponent({ cell, isInBox, isMatch, isTapStart, onTap }) {
  if (!cell.alive) return <div className="gp-cell gp-cell-dead" />;

  const bg = cell.paprika ? PAPRIKA_BG[cell.paprika] : undefined;

  return (
    <div
      className={`gp-cell gp-cell-alive ${isInBox ? 'gp-cell-inbox' : ''} ${isMatch ? 'gp-cell-match' : ''} ${isTapStart ? 'gp-cell-tap-start' : ''}`}
      style={bg ? { background: bg } : undefined}
      onClick={(e) => { e.stopPropagation(); onTap(); }}
    >
      {cell.paprika && (
        <div className="gp-cell-paprika">
          <PaprikaIcon type={cell.paprika} />
        </div>
      )}
      <span className="gp-cell-number" style={{ color: NUMBER_COLORS[cell.number] }}>
        {cell.number}
      </span>
    </div>
  );
}

export default memo(CellComponent);
