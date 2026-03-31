import { motion } from 'framer-motion';

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export default function HUD({ mines, flagCount, timer, gameState }) {
  return (
    <div className="hud">
      <div className="hud-item">
        <span className="hud-icon">🐱</span>
        <span className="hud-label">고양이</span>
        <motion.span
          className="hud-value"
          key={mines - flagCount}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
        >
          {mines - flagCount}
        </motion.span>
      </div>
      <div className="hud-item">
        <span className="hud-icon">🌻</span>
        <span className="hud-label">해바라기씨</span>
        <motion.span
          className="hud-value"
          key={flagCount}
          initial={{ scale: 1.3 }}
          animate={{ scale: 1 }}
        >
          {flagCount}
        </motion.span>
      </div>
      <div className="hud-item">
        <span className="hud-icon">⏱️</span>
        <span className="hud-label">시간</span>
        <span className="hud-value">{formatTime(timer)}</span>
      </div>
      {gameState === 'won' && (
        <motion.div
          className="hud-status hud-won"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          🎉 클리어!
        </motion.div>
      )}
      {gameState === 'lost' && (
        <motion.div
          className="hud-status hud-lost"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          😿 게임 오버
        </motion.div>
      )}
    </div>
  );
}
