import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Challenge({ onGenerate, onJoin }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('menu'); // menu | create | join
  const [code, setCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreate = () => {
    const c = onGenerate();
    setCode(c);
    setMode('create');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoin = () => {
    const result = onJoin(inputCode.trim());
    if (result) {
      setOpen(false);
      setMode('menu');
      setInputCode('');
    } else {
      alert('잘못된 대결 코드야! 다시 확인해봐 🐹');
    }
  };

  return (
    <>
      <button className="btn btn-challenge" onClick={() => { setOpen(true); setMode('menu'); }}>
        ⚔️ 대결
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
              className="challenge-panel"
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              onClick={e => e.stopPropagation()}
            >
              {mode === 'menu' && (
                <>
                  <h2>⚔️ 친구와 대결!</h2>
                  <p className="challenge-desc">
                    같은 맵으로 누가 더 빨리 클리어하는지 겨뤄봐!
                  </p>
                  <div className="challenge-buttons">
                    <button className="btn btn-create" onClick={handleCreate}>
                      🎲 대결 코드 만들기
                    </button>
                    <button className="btn btn-join" onClick={() => setMode('join')}>
                      🔗 코드로 참가하기
                    </button>
                  </div>
                </>
              )}

              {mode === 'create' && (
                <>
                  <h2>🎲 대결 코드 생성!</h2>
                  <p className="challenge-desc">이 코드를 친구에게 보내줘:</p>
                  <div className="challenge-code-box">
                    <code className="challenge-code">{code}</code>
                    <button className="btn btn-copy" onClick={handleCopy}>
                      {copied ? '✅ 복사됨!' : '📋 복사'}
                    </button>
                  </div>
                  <p className="challenge-hint">
                    친구가 이 코드를 입력하면 똑같은 맵으로 플레이할 수 있어!
                  </p>
                  <button className="btn btn-small" onClick={() => { setOpen(false); setMode('menu'); }}>
                    게임 시작하기
                  </button>
                </>
              )}

              {mode === 'join' && (
                <>
                  <h2>🔗 대결 참가!</h2>
                  <p className="challenge-desc">친구한테 받은 코드를 입력해:</p>
                  <div className="challenge-input-box">
                    <input
                      className="challenge-input"
                      type="text"
                      value={inputCode}
                      onChange={e => setInputCode(e.target.value)}
                      placeholder="대결 코드 붙여넣기..."
                      onKeyDown={e => e.key === 'Enter' && handleJoin()}
                    />
                    <button className="btn btn-go" onClick={handleJoin}>
                      🐹 도전!
                    </button>
                  </div>
                  <button className="btn btn-small btn-back" onClick={() => setMode('menu')}>
                    ← 뒤로
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
