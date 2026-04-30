import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../themes/ThemeContext';
import PixelHamster from '../../../themes/pixel/PixelHamster';

const CHEEK_SIZES = [
  { scale: 1, label: '○○' },
  { scale: 1.1, label: '◎◎' },
  { scale: 1.2, label: '●●' },
  { scale: 1.35, label: '⬤⬤' },
];

function getCheekLevel(revealed, total) {
  if (total === 0) return 0;
  const ratio = revealed / total;
  if (ratio < 0.25) return 0;
  if (ratio < 0.5) return 1;
  if (ratio < 0.75) return 2;
  return 3;
}

export default function Hamster({ gameState, lastAction, revealedCount, totalSafe }) {
  const { theme } = useTheme();

  if (theme === 'pixel') {
    return <PixelHamster gameState={gameState} lastAction={lastAction} revealedCount={revealedCount} totalSafe={totalSafe} />;
  }

  const cheekLevel = getCheekLevel(revealedCount, totalSafe);
  const cheekSize = CHEEK_SIZES[cheekLevel];

  const getExpression = () => {
    if (gameState === 'lost') return 'shocked';
    if (gameState === 'won') return 'clear';
    if (lastAction?.type === 'reveal') return 'eating';
    return 'idle';
  };

  const expression = getExpression();

  return (
    <div className="hamster-container">
      <AnimatePresence mode="wait">
        {expression === 'eating' && (
          <motion.div
            key="eating-text"
            className="hamster-speech"
            initial={{ opacity: 0, y: 10, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3 }}
          >
            왁왁왁!
          </motion.div>
        )}
        {expression === 'shocked' && (
          <motion.div
            key="shocked-text"
            className="hamster-speech speech-scared"
            initial={{ opacity: 0, scale: 2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            끼이익!!
          </motion.div>
        )}
        {expression === 'clear' && (
          <motion.div
            key="clear-text"
            className="hamster-speech speech-happy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            뿌듯! 👍
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`hamster hamster-${expression}`}
        animate={
          expression === 'shocked'
            ? { x: [0, -10, 10, -10, 10, 0], rotate: [0, -15, 15, -10, 5, 0] }
            : expression === 'eating'
            ? { y: [0, -3, 0, -3, 0] }
            : expression === 'clear'
            ? { y: [0, -10, 0], rotate: [0, 5, -5, 0] }
            : { y: [0, -2, 0] }
        }
        transition={
          expression === 'shocked'
            ? { duration: 0.5 }
            : expression === 'eating'
            ? { duration: 0.4, repeat: 2 }
            : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        {/* 햄스터 바디 */}
        <div className="hamster-body">
          {/* 귀 */}
          <div className="hamster-ear hamster-ear-l" />
          <div className="hamster-ear hamster-ear-r" />
          {/* 얼굴 */}
          <div className="hamster-face">
            {/* 눈 */}
            <div className={`hamster-eye hamster-eye-l ${expression === 'shocked' ? 'eye-wide' : ''} ${expression === 'clear' ? 'eye-happy' : ''}`}>
              {expression !== 'clear' && <div className="hamster-pupil" />}
            </div>
            <div className={`hamster-eye hamster-eye-r ${expression === 'shocked' ? 'eye-wide' : ''} ${expression === 'clear' ? 'eye-happy' : ''}`}>
              {expression !== 'clear' && <div className="hamster-pupil" />}
            </div>
            {/* 코 */}
            <div className="hamster-nose" />
            {/* 입 */}
            <div className={`hamster-mouth ${expression === 'eating' ? 'mouth-eating' : ''} ${expression === 'shocked' ? 'mouth-shocked' : ''} ${expression === 'clear' ? 'mouth-happy' : ''}`} />
            {/* 볼따구 */}
            <motion.div
              className="hamster-cheek hamster-cheek-l"
              animate={{ scale: cheekSize.scale }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            <motion.div
              className="hamster-cheek hamster-cheek-r"
              animate={{ scale: cheekSize.scale }}
              transition={{ type: 'spring', stiffness: 300 }}
            />
            {/* 수염 */}
            <div className="hamster-whisker hamster-wh-l" />
            <div className="hamster-whisker hamster-wh-r" />
          </div>
          {/* 손 */}
          {expression === 'eating' && (
            <motion.div
              className="hamster-hands"
              animate={{ rotate: [0, 10, -10, 10, 0] }}
              transition={{ duration: 0.3, repeat: Infinity }}
            >
              <div className="hamster-hand-l" />
              <div className="hamster-hand-r" />
              <div className="hamster-cheese-piece">🧀</div>
            </motion.div>
          )}
          {expression === 'clear' && (
            <motion.div
              className="hamster-hands"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <div className="hamster-hand-l thumb-up">👍</div>
            </motion.div>
          )}
          {/* 배 */}
          <div className="hamster-belly" />
        </div>
      </motion.div>

      <div className="hamster-cheek-status">
        볼따구: {cheekSize.label}
      </div>
    </div>
  );
}
