import { memo } from 'react';

// 파프리카 색상 설정
const PAPRIKA_CONFIG = {
  green:  { fill: '#8BC78F', highlight: '#B5DFB8', stem: '#4A8C4E', numColor: '#1B5E20', bg: '#EDF7EE' },
  yellow: { fill: '#F5D76E', highlight: '#FAE89D', stem: '#C8A415', numColor: '#F57F17', bg: '#FDFAED' },
  orange: { fill: '#F0A858', highlight: '#F5C48A', stem: '#C07020', numColor: '#E65100', bg: '#FDF3E8' },
  red:    { fill: '#E88080', highlight: '#F0ABAB', stem: '#B83030', numColor: '#B71C1C', bg: '#FDECEC' },
};

// 숫자 색 - 진한 갈색
const NUM_COLOR = '#5D4037';

function BigPaprika({ type }) {
  const cfg = PAPRIKA_CONFIG[type];
  if (!cfg) return null;
  return (
    <svg viewBox="0 0 40 40" className="gp-paprika-bg" aria-hidden="true">
      {/* 꼭지 */}
      <path d="M20 3 C18.5 3, 17 4.5, 17 6 L23 6 C23 4.5, 21.5 3, 20 3Z" fill={cfg.stem} />
      <line x1="20" y1="1.5" x2="20" y2="4.5" stroke={cfg.stem} strokeWidth="1.5" strokeLinecap="round" />
      {/* 몸통 - 통통하게 */}
      <path d="M8 10 C5 10, 3 15, 3 21 C3 30, 8 36, 14 38 C16.5 39, 23.5 39, 26 38 C32 36, 37 30, 37 21 C37 15, 35 10, 32 10Z" fill={cfg.fill} />
      {/* 하이라이트 */}
      <path d="M13 14 C11 18, 10.5 24, 12 30" stroke={cfg.highlight} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.6" />
      <ellipse cx="14" cy="16" rx="3" ry="4" fill={cfg.highlight} opacity="0.3" />
    </svg>
  );
}

function CellComponent({ cell, isInBox, isMatch, isTapStart }) {
  if (!cell.alive) return <div className="gp-cell gp-cell-dead" />;

  const hasPaprika = !!cell.paprika;
  const cfg = hasPaprika ? PAPRIKA_CONFIG[cell.paprika] : null;
  const bgStyle = cfg ? { background: cfg.bg } : undefined;

  return (
    <div
      className={`gp-cell gp-cell-alive ${isInBox ? 'gp-cell-inbox' : ''} ${isMatch ? 'gp-cell-match' : ''} ${isTapStart ? 'gp-cell-tap-start' : ''}`}
      style={bgStyle}
    >
      {hasPaprika && <BigPaprika type={cell.paprika} />}
      <span className="gp-cell-number" style={{ color: NUM_COLOR }}>
        {cell.number}
      </span>
    </div>
  );
}

export default memo(CellComponent);
