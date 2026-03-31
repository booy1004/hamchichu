import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Confetti() {
  const pieces = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    color: ['#4CAF50', '#FDD835', '#FB8C00', '#E53935', '#AB47BC', '#42A5F5'][i % 6],
    size: 6 + Math.random() * 8,
  }));

  return (
    <div className="confetti-container">
      {pieces.map(p => (
        <motion.div
          key={p.id}
          className="confetti-piece"
          style={{ left: `${p.x}%`, backgroundColor: p.color, width: p.size, height: p.size * 0.6 }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: '100vh', opacity: 0, rotate: 720 }}
          transition={{ duration: 2 + Math.random(), delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}

export default function Overlay({ gameState, score, onReset, onSaveRecord }) {
  const [name, setName] = useState('');
  const [saved, setSaved] = useState(false);
  const isGood = score >= 30;

  const handleSave = () => {
    const playerName = name.trim() || '사쿠야';
    onSaveRecord(playerName);
    setSaved(true);
  };

  const handleReset = () => {
    setSaved(false);
    setName('');
    onReset();
  };

  return (
    <AnimatePresence>
      {gameState === 'ended' && (
        <motion.div
          className="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.3 }}
        >
          {isGood && <Confetti />}
          <motion.div
            className="overlay-content gp-overlay"
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.5 }}
          >
            {isGood ? (
              <>
                <div className="overlay-emoji">🐷🫑</div>
                <h2>뿌이뿌이~ 배불러!</h2>
                <p>사쿠야가 파프리카를 잔뜩 먹었어요!</p>
                <div className="gp-overlay-stats">
                  <div className="gp-stat">
                    <span className="gp-stat-label">최종 점수</span>
                    <span className="gp-stat-value">{score}점</span>
                  </div>
                </div>

                {!saved ? (
                  <div className="name-input-area">
                    <p className="name-label">🏆 기록에 남길 이름을 입력해줘!</p>
                    <div className="name-input-row">
                      <input
                        className="name-input"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="사쿠야"
                        maxLength={10}
                        onKeyDown={e => e.key === 'Enter' && handleSave()}
                        autoFocus
                      />
                      <motion.button
                        className="btn btn-save"
                        onClick={handleSave}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        저장!
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <motion.p
                    className="name-saved"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    ✅ 기록 저장 완료!
                  </motion.p>
                )}
              </>
            ) : (
              <>
                <motion.div className="overlay-emoji" animate={{ rotate: [0, -5, 5, 0] }} transition={{ duration: 1, repeat: 2 }}>
                  🐷💨
                </motion.div>
                <h2>뿌이... 아쉬워!</h2>
                <p>사쿠야가 더 먹고 싶대요...</p>
                <div className="gp-overlay-stats">
                  <div className="gp-stat">
                    <span className="gp-stat-label">최종 점수</span>
                    <span className="gp-stat-value">{score}점</span>
                  </div>
                </div>
              </>
            )}
            <motion.button
              className="btn btn-restart gp-btn-restart"
              onClick={handleReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🫑 다시 도전!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
