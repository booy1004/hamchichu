import { motion, AnimatePresence } from 'framer-motion';

// 픽셀 1칸 = 4px, 16x16 그리드 = 64x64 SVG
const P = 4;

// 색상 팔레트
const C = {
  outline: '#6B4226',
  fur: '#F0A830',
  furLight: '#F8C860',
  furDark: '#D08820',
  white: '#FFF8F0',
  belly: '#FFF0D8',
  pink: '#F8A0B0',
  pinkLight: '#FFC8D8',
  eye: '#282020',
  eyeWhite: '#FFFFFF',
  nose: '#E87080',
  mouth: '#C06050',
  cheekPink: '#F8B0C0',
};

// 각 expression별 픽셀 데이터 (16x16 그리드)
// 0=투명, 1=outline, 2=fur, 3=furLight, 4=white/belly, 5=pink(귀안쪽), 6=eye, 7=nose, 8=cheekPink, 9=furDark
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

// idle 햄스터 - 정면 앉아있는 모습 (16x16)
const IDLE = [
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
  [0,0,0,1,5,2,1,0,0,1,2,5,1,0,0,0],
  [0,0,0,1,2,2,1,0,0,1,2,2,1,0,0,0],
  [0,0,1,2,3,3,2,1,1,2,3,3,2,1,0,0],
  [0,1,2,3,3,3,3,2,2,3,3,3,3,2,1,0],
  [0,1,2,3,6,3,8,2,2,8,3,6,3,2,1,0],
  [0,1,2,3,6,3,8,2,2,8,3,6,3,2,1,0],
  [0,1,2,3,3,3,7,3,3,7,3,3,3,2,1,0],
  [0,1,2,2,3,3,3,9,9,3,3,3,2,2,1,0],
  [0,0,1,2,2,4,4,4,4,4,4,2,2,1,0,0],
  [0,0,1,2,4,4,4,4,4,4,4,4,2,1,0,0],
  [0,0,1,2,4,4,4,4,4,4,4,4,2,1,0,0],
  [0,0,1,2,2,4,4,4,4,4,4,2,2,1,0,0],
  [0,0,0,1,2,2,9,2,2,9,2,2,1,0,0,0],
  [0,0,0,1,9,9,1,0,0,1,9,9,1,0,0,0],
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
];

// eating 햄스터 - 볼 부풀어오른 모습
const EATING = [
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
  [0,0,0,1,5,2,1,0,0,1,2,5,1,0,0,0],
  [0,0,0,1,2,2,1,0,0,1,2,2,1,0,0,0],
  [0,0,1,2,3,3,2,1,1,2,3,3,2,1,0,0],
  [0,1,2,3,3,3,3,2,2,3,3,3,3,2,1,0],
  [1,8,2,3,6,3,8,2,2,8,3,6,3,2,8,1],
  [1,8,2,3,6,3,8,2,2,8,3,6,3,2,8,1],
  [1,8,2,3,3,3,7,3,3,7,3,3,3,2,8,1],
  [0,1,2,2,3,3,3,9,9,3,3,3,2,2,1,0],
  [0,0,1,2,2,4,4,4,4,4,4,2,2,1,0,0],
  [0,0,1,2,4,4,4,4,4,4,4,4,2,1,0,0],
  [0,0,1,2,4,4,4,4,4,4,4,4,2,1,0,0],
  [0,0,1,2,2,4,4,4,4,4,4,2,2,1,0,0],
  [0,0,0,1,2,2,9,2,2,9,2,2,1,0,0,0],
  [0,0,0,1,9,9,1,0,0,1,9,9,1,0,0,0],
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
];

// shocked 햄스터 - 눈 크게 뜬 모습 (X 입)
const SHOCKED = [
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
  [0,0,0,1,5,2,1,0,0,1,2,5,1,0,0,0],
  [0,0,0,1,2,2,1,0,0,1,2,2,1,0,0,0],
  [0,0,1,2,3,3,2,1,1,2,3,3,2,1,0,0],
  [0,1,2,3,1,1,3,2,2,3,1,1,3,2,1,0],
  [0,1,2,1,4,6,1,2,2,1,6,4,1,2,1,0],
  [0,1,2,1,6,4,1,2,2,1,4,6,1,2,1,0],
  [0,1,2,3,1,1,7,3,3,7,1,1,3,2,1,0],
  [0,1,2,2,3,3,3,1,1,3,3,3,2,2,1,0],
  [0,0,1,2,2,4,1,4,4,1,4,2,2,1,0,0],
  [0,0,1,2,4,4,4,1,1,4,4,4,2,1,0,0],
  [0,0,1,2,4,4,4,4,4,4,4,4,2,1,0,0],
  [0,0,1,2,2,4,4,4,4,4,4,2,2,1,0,0],
  [0,0,0,1,2,2,9,2,2,9,2,2,1,0,0,0],
  [0,0,0,1,9,9,1,0,0,1,9,9,1,0,0,0],
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
];

// clear 햄스터 - 눈 감고 웃는 모습
const CLEAR = [
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
  [0,0,0,1,5,2,1,0,0,1,2,5,1,0,0,0],
  [0,0,0,1,2,2,1,0,0,1,2,2,1,0,0,0],
  [0,0,1,2,3,3,2,1,1,2,3,3,2,1,0,0],
  [0,1,2,3,3,3,3,2,2,3,3,3,3,2,1,0],
  [0,1,2,3,1,3,8,2,2,8,3,1,3,2,1,0],
  [0,1,2,1,3,1,8,2,2,8,1,3,1,2,1,0],
  [0,1,2,3,3,3,7,3,3,7,3,3,3,2,1,0],
  [0,1,2,2,3,1,3,3,3,3,1,3,2,2,1,0],
  [0,0,1,2,2,4,1,1,1,1,4,2,2,1,0,0],
  [0,0,1,2,4,4,4,4,4,4,4,4,2,1,0,0],
  [0,0,1,2,4,4,4,4,4,4,4,4,2,1,0,0],
  [0,0,1,2,2,4,4,4,4,4,4,2,2,1,0,0],
  [0,0,0,1,2,2,9,2,2,9,2,2,1,0,0,0],
  [0,0,0,1,9,9,1,0,0,1,9,9,1,0,0,0],
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
];

const SPRITES = { idle: IDLE, eating: EATING, shocked: SHOCKED, clear: CLEAR };

function PixelSprite({ data, size = 80 }) {
  const px = size / 16;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
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

const CHEEK_LABELS = ['○○', '◎◎', '●●', '⬤⬤'];

function getCheekLevel(revealed, total) {
  if (total === 0) return 0;
  const ratio = revealed / total;
  if (ratio < 0.25) return 0;
  if (ratio < 0.5) return 1;
  if (ratio < 0.75) return 2;
  return 3;
}

export default function PixelHamster({ gameState, lastAction, revealedCount, totalSafe }) {
  const cheekLevel = getCheekLevel(revealedCount, totalSafe);

  const getExpression = () => {
    if (gameState === 'lost') return 'shocked';
    if (gameState === 'won') return 'clear';
    if (lastAction?.type === 'reveal') return 'eating';
    return 'idle';
  };

  const expression = getExpression();
  const sprite = SPRITES[expression] || IDLE;

  return (
    <div className="hamster-container">
      <div className="hamster-speech-wrap">
        <AnimatePresence mode="wait">
          {expression === 'eating' && (
            <motion.div
              key="px-eating"
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
              key="px-shocked"
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
              key="px-clear"
              className="hamster-speech speech-happy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              뿌듯! 👍
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        style={{ display: 'flex', justifyContent: 'center' }}
        animate={
          expression === 'shocked'
            ? { x: [0, -6, 6, -6, 6, 0], rotate: [0, -10, 10, -5, 5, 0] }
            : expression === 'eating'
            ? { y: [0, -4, 0, -4, 0] }
            : expression === 'clear'
            ? { y: [0, -8, 0], rotate: [0, 5, -5, 0] }
            : { y: [0, -3, 0] }
        }
        transition={
          expression === 'shocked'
            ? { duration: 0.5 }
            : expression === 'eating'
            ? { duration: 0.4, repeat: 2 }
            : { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <PixelSprite data={sprite} size={80} />
      </motion.div>

      <div className="hamster-cheek-status">
        볼따구: {CHEEK_LABELS[cheekLevel]}
      </div>
    </div>
  );
}
