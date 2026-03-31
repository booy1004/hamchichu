import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BELLY_SIZES = [
  { scale: 1, label: '날씬' },
  { scale: 1.08, label: '약간 통통' },
  { scale: 1.18, label: '통통' },
  { scale: 1.3, label: '최대 먹보' },
];

function getBellyLevel(score) {
  if (score < 15) return 0;
  if (score < 40) return 1;
  if (score < 70) return 2;
  return 3;
}

export default function GuineaPig({ gameState, score, boxSum, boxCount }) {
  const bellyLevel = getBellyLevel(score);
  const bellySize = BELLY_SIZES[bellyLevel];
  const [showSpeech, setShowSpeech] = useState(false);
  const prevScore = useRef(score);
  const timerRef = useRef(null);

  // 점수 올라가면 말풍선 2초간 표시
  useEffect(() => {
    if (score > prevScore.current && gameState === 'playing') {
      setShowSpeech(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShowSpeech(false), 2000);
    }
    prevScore.current = score;
    return () => clearTimeout(timerRef.current);
  }, [score, gameState]);

  const getExpression = () => {
    if (gameState === 'ended' && score >= 30) return 'clear';
    if (gameState === 'ended') return 'sad';
    if (showSpeech) return 'eating';
    if (boxCount > 0 && boxSum === 10) return 'excited';
    return 'idle';
  };

  const expression = getExpression();

  return (
    <div className="gp-container">
      <AnimatePresence mode="wait">
        {showSpeech && gameState === 'playing' && (
          <motion.div
            key="eating-text"
            className="gp-speech speech-excited"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            뿌이뿌이~
          </motion.div>
        )}
        {expression === 'excited' && !showSpeech && (
          <motion.div
            key="match-text"
            className="gp-speech speech-excited"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            뿌이뿌이!!!
          </motion.div>
        )}
        {expression === 'sad' && (
          <motion.div
            key="sad-text"
            className="gp-speech speech-sad"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            뿌이...
          </motion.div>
        )}
        {expression === 'clear' && (
          <motion.div
            key="clear-text"
            className="gp-speech speech-happy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            뿌이뿌이~ 배불러!
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`gp-body-wrap gp-${expression}`}
        animate={
          expression === 'excited' || expression === 'eating'
            ? { y: [0, -12, 0, -8, 0] }
            : expression === 'sad'
            ? { rotate: [0, 3, -3, 0] }
            : { y: [0, -2, 0] }
        }
        transition={
          expression === 'excited' || expression === 'eating'
            ? { duration: 0.5, repeat: Infinity, repeatDelay: 0.3 }
            : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <div className={`gp-body ${expression === 'sad' ? 'gp-turned' : ''}`}>
          <div className="gp-ear gp-ear-l" />
          <div className="gp-ear gp-ear-r" />
          <div className="gp-face">
            <div className={`gp-eye gp-eye-l ${expression === 'excited' || expression === 'eating' ? 'eye-sparkle' : ''} ${expression === 'clear' ? 'eye-closed' : ''} ${expression === 'sad' ? 'eye-sad' : ''}`}>
              {expression !== 'clear' && expression !== 'sad' && <div className="gp-pupil" />}
            </div>
            <div className={`gp-eye gp-eye-r ${expression === 'excited' || expression === 'eating' ? 'eye-sparkle' : ''} ${expression === 'clear' ? 'eye-closed' : ''} ${expression === 'sad' ? 'eye-sad' : ''}`}>
              {expression !== 'clear' && expression !== 'sad' && <div className="gp-pupil" />}
            </div>
            <div className="gp-nose" />
            <div className={`gp-mouth ${expression === 'eating' || expression === 'excited' ? 'mouth-open' : ''} ${expression === 'clear' ? 'mouth-happy' : ''}`} />
            <div className="gp-cheek gp-cheek-l" />
            <div className="gp-cheek gp-cheek-r" />
            <div className="gp-whisker gp-wh-l1" />
            <div className="gp-whisker gp-wh-l2" />
            <div className="gp-whisker gp-wh-r1" />
            <div className="gp-whisker gp-wh-r2" />
          </div>
          <motion.div
            className="gp-belly"
            animate={{ scaleX: bellySize.scale, scaleY: bellySize.scale }}
            transition={{ type: 'spring', stiffness: 300 }}
          />
          <div className="gp-foot gp-foot-l" />
          <div className="gp-foot gp-foot-r" />
        </div>
      </motion.div>

      <div className="gp-belly-status">
        배: {bellySize.label}
      </div>
    </div>
  );
}
