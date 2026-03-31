import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DIFF_LABELS = { easy: '🌱 쉬움', medium: '🌿 보통', hard: '🌳 어려움' };

export default function Records({ records, onClear }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState('easy');

  return (
    <>
      <button className="btn btn-records" onClick={() => setOpen(true)}>
        🏆 기록
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="records-panel"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={e => e.stopPropagation()}
            >
              <h2>🏆 베스트 기록</h2>
              <div className="records-tabs">
                {Object.entries(DIFF_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    className={`btn btn-tab ${tab === key ? 'btn-active' : ''}`}
                    onClick={() => setTab(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="records-list">
                {(!records[tab] || records[tab].length === 0) ? (
                  <p className="records-empty">아직 기록이 없어요 🐹</p>
                ) : (
                  <table className="records-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>이름</th>
                        <th>점수</th>
                        <th>콤보</th>
                        <th>날짜</th>
                      </tr>
                    </thead>
                    <tbody>
                      {records[tab].map((r, i) => (
                        <tr key={i} className={i === 0 ? 'record-gold' : ''}>
                          <td>{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</td>
                          <td>{r.name}</td>
                          <td>{r.score}점</td>
                          <td>{r.maxCombo}</td>
                          <td>{r.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="records-actions">
                <button className="btn btn-small" onClick={onClear}>🗑️ 초기화</button>
                <button className="btn btn-small" onClick={() => setOpen(false)}>닫기</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
