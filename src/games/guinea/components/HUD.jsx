import { motion } from 'framer-motion';

export default function HUD({ score, timeLeft, gameState, boxSum, boxCount }) {
  return (
    <div className="gp-hud">
      <div className="gp-hud-item">
        <span className="gp-hud-icon">🏆</span>
        <span className="gp-hud-label">점수</span>
        <motion.span
          className="gp-hud-value"
          key={score}
          initial={{ scale: 1.4 }}
          animate={{ scale: 1 }}
        >
          {score}
        </motion.span>
      </div>
      <div className="gp-hud-item">
        <span className="gp-hud-icon">⏱️</span>
        <span className="gp-hud-label">시간</span>
        <span className={`gp-hud-value ${timeLeft <= 10 ? 'time-danger' : ''}`}>
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </span>
      </div>
      {boxCount > 0 && (
        <motion.div
          className={`gp-hud-sum ${boxSum === 10 ? 'sum-match' : boxSum > 10 ? 'sum-over' : ''}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          합: {boxSum}
        </motion.div>
      )}
      {gameState === 'ended' && (
        <motion.div
          className="gp-hud-status"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          🐷 게임 종료!
        </motion.div>
      )}
    </div>
  );
}
