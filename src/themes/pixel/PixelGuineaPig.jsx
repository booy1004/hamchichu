import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const P = 4;

// 기니피그 색상 팔레트 (갈색/크림 기니피그)
const C = {
  outline: '#5D4037',
  fur: '#BCAAA4',
  furLight: '#D7CCC8',
  furDark: '#8D6E63',
  white: '#FFF8F0',
  belly: '#EFEBE9',
  pink: '#FFAB91',
  pinkLight: '#FFCCBC',
  eye: '#282020',
  nose: '#FF8A80',
  mouth: '#8D6E63',
  cheekPink: '#FFCCBC',
};

const COLOR_MAP = {
  0: 'transparent',
  1: C.outline,
  2: C.fur,
  3: C.furLight,
  4: C.white,
  5: C.pink,
  6: C.eye,
  7: C.nose,
  8: C.cheekPink,
  9: C.furDark,
};

// idle 기니피그 - 둥글둥글 앉아있는 모습 (16x14, 기니피그는 납작)
const IDLE = [
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
  [0,0,0,1,5,3,1,0,0,1,3,5,1,0,0,0],
  [0,0,1,3,3,3,3,1,1,3,3,3,3,1,0,0],
  [0,1,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
  [1,2,3,3,6,3,8,3,3,8,3,6,3,3,2,1],
  [1,2,3,3,6,3,8,3,3,8,3,6,3,3,2,1],
  [1,2,2,3,3,3,3,7,7,3,3,3,3,2,2,1],
  [1,2,2,3,3,3,3,9,9,3,3,3,3,2,2,1],
  [0,1,2,2,4,4,4,4,4,4,4,4,2,2,1,0],
  [0,1,2,4,4,4,4,4,4,4,4,4,4,2,1,0],
  [0,1,2,4,4,4,4,4,4,4,4,4,4,2,1,0],
  [0,0,1,2,2,4,4,4,4,4,4,2,2,1,0,0],
  [0,0,0,1,9,9,1,2,2,1,9,9,1,0,0,0],
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
];

// eating 기니피그 - 입 벌린 모습
const EATING = [
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
  [0,0,0,1,5,3,1,0,0,1,3,5,1,0,0,0],
  [0,0,1,3,3,3,3,1,1,3,3,3,3,1,0,0],
  [0,1,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
  [1,2,3,3,6,3,8,3,3,8,3,6,3,3,2,1],
  [1,2,3,3,6,3,8,3,3,8,3,6,3,3,2,1],
  [1,2,2,3,3,3,3,7,7,3,3,3,3,2,2,1],
  [1,2,2,3,3,3,1,9,9,1,3,3,3,2,2,1],
  [0,1,2,2,4,4,1,9,9,1,4,4,2,2,1,0],
  [0,1,2,4,4,4,4,1,1,4,4,4,4,2,1,0],
  [0,1,2,4,4,4,4,4,4,4,4,4,4,2,1,0],
  [0,0,1,2,2,4,4,4,4,4,4,2,2,1,0,0],
  [0,0,0,1,9,9,1,2,2,1,9,9,1,0,0,0],
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
];

// excited 기니피그 - 반짝이는 눈
const EXCITED = [
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
  [0,0,0,1,5,3,1,0,0,1,3,5,1,0,0,0],
  [0,0,1,3,3,3,3,1,1,3,3,3,3,1,0,0],
  [0,1,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
  [1,2,3,1,4,1,8,3,3,8,1,4,1,3,2,1],
  [1,2,3,1,6,1,8,3,3,8,1,6,1,3,2,1],
  [1,2,2,3,1,3,3,7,7,3,3,1,3,2,2,1],
  [1,2,2,3,3,3,1,9,9,1,3,3,3,2,2,1],
  [0,1,2,2,4,4,1,9,9,1,4,4,2,2,1,0],
  [0,1,2,4,4,4,4,1,1,4,4,4,4,2,1,0],
  [0,1,2,4,4,4,4,4,4,4,4,4,4,2,1,0],
  [0,0,1,2,2,4,4,4,4,4,4,2,2,1,0,0],
  [0,0,0,1,9,9,1,2,2,1,9,9,1,0,0,0],
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
];

// sad 기니피그 - 처진 눈
const SAD = [
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
  [0,0,0,1,5,3,1,0,0,1,3,5,1,0,0,0],
  [0,0,1,3,3,3,3,1,1,3,3,3,3,1,0,0],
  [0,1,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
  [1,2,3,3,1,1,3,3,3,3,1,1,3,3,2,1],
  [1,2,3,3,3,6,8,3,3,8,6,3,3,3,2,1],
  [1,2,2,3,3,3,3,7,7,3,3,3,3,2,2,1],
  [1,2,2,3,3,3,3,1,1,3,3,3,3,2,2,1],
  [0,1,2,2,4,4,4,4,4,4,4,4,2,2,1,0],
  [0,1,2,4,4,4,4,4,4,4,4,4,4,2,1,0],
  [0,1,2,4,4,4,4,4,4,4,4,4,4,2,1,0],
  [0,0,1,2,2,4,4,4,4,4,4,2,2,1,0,0],
  [0,0,0,1,9,9,1,2,2,1,9,9,1,0,0,0],
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
];

// clear 기니피그 - 눈 감고 행복
const CLEAR_GP = [
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
  [0,0,0,1,5,3,1,0,0,1,3,5,1,0,0,0],
  [0,0,1,3,3,3,3,1,1,3,3,3,3,1,0,0],
  [0,1,3,3,3,3,3,3,3,3,3,3,3,3,1,0],
  [1,2,3,3,3,3,8,3,3,8,3,3,3,3,2,1],
  [1,2,3,1,3,1,8,3,3,8,1,3,1,3,2,1],
  [1,2,2,3,1,3,3,7,7,3,3,1,3,2,2,1],
  [1,2,2,3,3,1,3,3,3,3,1,3,3,2,2,1],
  [0,1,2,2,4,4,1,1,1,1,4,4,2,2,1,0],
  [0,1,2,4,4,4,4,4,4,4,4,4,4,2,1,0],
  [0,1,2,4,4,4,4,4,4,4,4,4,4,2,1,0],
  [0,0,1,2,2,4,4,4,4,4,4,2,2,1,0,0],
  [0,0,0,1,9,9,1,2,2,1,9,9,1,0,0,0],
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
];

const SPRITES = { idle: IDLE, eating: EATING, excited: EXCITED, sad: SAD, clear: CLEAR_GP };

function PixelSprite({ data, size = 80 }) {
  const rows = data.length;
  const cols = data[0].length;
  const px = size / cols;
  const h = rows * px;
  return (
    <svg
      width={size}
      height={h}
      viewBox={`0 0 ${size} ${h}`}
      style={{ imageRendering: 'pixelated' }}
      aria-hidden="true"
    >
      {data.map((row, r) =>
        row.map((val, c) => {
          if (val === 0) return null;
          return (
            <rect
              key={`${r}-${c}`}
              x={c * px}
              y={r * px}
              width={px}
              height={px}
              fill={COLOR_MAP[val]}
            />
          );
        })
      )}
    </svg>
  );
}

const BELLY_LABELS = ['날씬', '약간 통통', '통통', '최대 먹보'];

function getBellyLevel(score) {
  if (score < 15) return 0;
  if (score < 40) return 1;
  if (score < 70) return 2;
  return 3;
}

export default function PixelGuineaPig({ gameState, score, boxSum, boxCount }) {
  const bellyLevel = getBellyLevel(score);
  const [showSpeech, setShowSpeech] = useState(false);
  const prevScore = useRef(score);
  const timerRef = useRef(null);

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
  const sprite = SPRITES[expression] || IDLE;

  return (
    <div className="gp-container">
      <AnimatePresence mode="wait">
        {showSpeech && gameState === 'playing' && (
          <motion.div
            key="px-gp-eating"
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
            key="px-gp-match"
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
            key="px-gp-sad"
            className="gp-speech speech-sad"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            뿌이...
          </motion.div>
        )}
        {expression === 'clear' && (
          <motion.div
            key="px-gp-clear"
            className="gp-speech speech-happy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            뿌이뿌이~ 배불러!
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        style={{ display: 'flex', justifyContent: 'center' }}
        animate={
          expression === 'excited' || expression === 'eating'
            ? { y: [0, -10, 0, -6, 0] }
            : expression === 'sad'
            ? { rotate: [0, 3, -3, 0] }
            : { y: [0, -3, 0] }
        }
        transition={
          expression === 'excited' || expression === 'eating'
            ? { duration: 0.5, repeat: Infinity, repeatDelay: 0.3 }
            : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <PixelSprite data={sprite} size={80} />
      </motion.div>

      <div className="gp-belly-status">
        배: {BELLY_LABELS[bellyLevel]}
      </div>
    </div>
  );
}
