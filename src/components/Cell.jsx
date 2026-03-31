import { motion } from 'framer-motion';

const NUMBER_COLORS = [
  '', '#4A90D9', '#6B8E23', '#E74C3C', '#8E44AD',
  '#D4A017', '#20B2AA', '#2C3E50', '#95A5A6'
];

const CAT_COLORS = ['#F4A460', '#808080', '#2C2C2C', '#FFD700', '#E8D5B7'];

function CheeseTile() {
  return (
    <div className="cheese-tile">
      <div className="cheese-hole hole-1" />
      <div className="cheese-hole hole-2" />
      <div className="cheese-hole hole-3" />
    </div>
  );
}

function SleepingCat({ catColor }) {
  return (
    <div className="cat-sleeping" style={{ '--cat-color': catColor }}>
      <div className="cat-body">
        <div className="cat-ear cat-ear-l" />
        <div className="cat-ear cat-ear-r" />
        <div className="cat-head">
          <div className="cat-eye-closed cat-eye-l" />
          <div className="cat-eye-closed cat-eye-r" />
          <div className="cat-nose" />
          <div className="cat-whisker cat-wh-l" />
          <div className="cat-whisker cat-wh-r" />
        </div>
        <div className="cat-tail" />
      </div>
      <span className="cat-zzz">z<span>z</span><span>z</span></span>
    </div>
  );
}

function AwakeCat({ catColor }) {
  return (
    <motion.div
      className="cat-awake"
      style={{ '--cat-color': catColor }}
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 15 }}
    >
      <div className="cat-body-awake">
        <div className="cat-ear cat-ear-l" />
        <div className="cat-ear cat-ear-r" />
        <div className="cat-head">
          <div className="cat-eye-open cat-eye-l">
            <div className="cat-pupil" />
          </div>
          <div className="cat-eye-open cat-eye-r">
            <div className="cat-pupil" />
          </div>
          <div className="cat-mouth-open">애옹!</div>
        </div>
      </div>
    </motion.div>
  );
}

function SunflowerSeed() {
  return (
    <motion.div
      className="sunflower-seed"
      initial={{ scale: 0, y: -20 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 12 }}
    >
      <svg viewBox="0 0 40 56" width="22" height="30">
        {/* 씨앗 본체 - 물방울/씨앗 형태 */}
        <path
          d="M20 2 C12 10, 6 22, 6 34 C6 46, 12 54, 20 54 C28 54, 34 46, 34 34 C34 22, 28 10, 20 2Z"
          fill="#3E2723"
        />
        {/* 씨앗 안쪽 그라데이션 */}
        <path
          d="M20 6 C14 13, 10 23, 10 33 C10 43, 14 50, 20 50 C26 50, 30 43, 30 33 C30 23, 26 13, 20 6Z"
          fill="#4E342E"
        />
        {/* 세로 줄무늬 (해바라기씨 특유의) */}
        <path d="M16 12 C14 22, 13 34, 15 48" stroke="#5D4037" strokeWidth="1.2" fill="none" opacity="0.6" />
        <path d="M20 4 C20 18, 20 34, 20 52" stroke="#5D4037" strokeWidth="1.2" fill="none" opacity="0.6" />
        <path d="M24 12 C26 22, 27 34, 25 48" stroke="#5D4037" strokeWidth="1.2" fill="none" opacity="0.6" />
        {/* 하이라이트 */}
        <ellipse cx="16" cy="20" rx="3" ry="6" fill="#6D4C41" opacity="0.5" />
        {/* 꼭대기 흰 점 (씨앗 끝) */}
        <ellipse cx="20" cy="50" rx="4" ry="2.5" fill="#EFEBE9" opacity="0.8" />
      </svg>
    </motion.div>
  );
}

export default function Cell({ cell, row, col, onClick, onRightClick, onDoubleClick, gameState }) {
  const catColor = CAT_COLORS[(row * 7 + col * 13) % CAT_COLORS.length];

  const handleClick = (e) => {
    e.preventDefault();
    onClick(row, col);
  };

  const handleContext = (e) => {
    e.preventDefault();
    onRightClick(row, col);
  };

  const handleDblClick = (e) => {
    e.preventDefault();
    onDoubleClick(row, col);
  };

  if (!cell.isRevealed) {
    return (
      <motion.button
        className="cell cell-hidden"
        onClick={handleClick}
        onContextMenu={handleContext}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        aria-label={cell.isFlagged ? '해바라기씨 표시됨' : '치즈 칸'}
      >
        {cell.isFlagged ? <SunflowerSeed /> : <CheeseTile />}
      </motion.button>
    );
  }

  // revealed
  if (cell.isMine) {
    return (
      <motion.div
        className="cell cell-mine"
        initial={{ backgroundColor: '#FFE4E1' }}
        animate={{ backgroundColor: ['#FFE4E1', '#FFB6C1', '#FFE4E1'] }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        {gameState === 'lost' ? <AwakeCat catColor={catColor} /> : <SleepingCat catColor={catColor} />}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="cell cell-revealed cell-clickable"
      initial={{ rotateY: 90 }}
      animate={{ rotateY: 0 }}
      transition={{ duration: 0.3 }}
      onDoubleClick={handleDblClick}
    >
      {cell.neighborMines > 0 && (
        <span className="cell-number" style={{ color: NUMBER_COLORS[cell.neighborMines] }}>
          {cell.neighborMines}
        </span>
      )}
    </motion.div>
  );
}
