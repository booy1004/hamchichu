import { motion, AnimatePresence } from 'framer-motion';

function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'][i % 6],
    size: 6 + Math.random() * 8,
  }));

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            backgroundColor: p.color,
            width: p.size,
            height: p.size * 0.6,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: '100vh', opacity: 0, rotate: 720 }}
          transition={{ duration: 2 + Math.random(), delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}

export default function Overlay({ gameState, timer, onReset }) {
  return (
    <AnimatePresence>
      {(gameState === 'won' || gameState === 'lost') && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: gameState === 'lost' ? 1 : 0.5 }}
        >
          {gameState === 'won' && <Confetti />}
          <motion.div
            className="overlay-content"
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, delay: gameState === 'lost' ? 1.2 : 0.7 }}
          >
            {gameState === 'won' ? (
              <>
                <div className="overlay-emoji">🐹👍</div>
                <h2>치즈 먹방 성공!</h2>
                <p>리쿠가 모든 치즈를 먹었어요!</p>
                <p className="overlay-time">클리어 시간: {Math.floor(timer / 60)}분 {timer % 60}초</p>
                <motion.div
                  className="overlay-hamster-clear"
                  animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <span className="big-emoji">🐹</span>
                  <motion.span
                    className="heart-pop"
                    animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1] }}
                    transition={{ duration: 0.5, delay: 1.5 }}
                  >
                    💕
                  </motion.span>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div
                  className="overlay-emoji"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: 2 }}
                >
                  🙀
                </motion.div>
                <h2>고양이한테 들켰다!</h2>
                <p>리쿠가 놀라서 치즈를 뿜었어요...</p>
                <motion.div
                  className="overlay-hamster-lost"
                  initial={{ x: 0 }}
                  animate={{ x: [0, -5, 5, -5, 5, 0], rotate: [0, -20, 20, -10, 10, 0] }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <span className="big-emoji">🐹💨</span>
                </motion.div>
              </>
            )}
            <motion.button
              className="btn btn-restart"
              onClick={onReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🧀 다시 도전!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
