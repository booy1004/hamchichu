// 에셋 경로 관리 - 나중에 힉스필드 영상/이미지로 교체할 때 여기만 수정하면 됨
const ASSETS = {
  hamster: {
    idle: null,       // → '/assets/hamster-idle.webm'
    eating: null,     // → '/assets/hamster-eating.webm'
    shocked: null,    // → '/assets/hamster-shocked.webm'
    clear: null,      // → '/assets/hamster-clear.webm'
  },
  cat: {
    sleeping: null,   // → '/assets/cat-sleeping.png'
    awake: null,      // → '/assets/cat-awake.webm'
  },
  seed: null,         // → '/assets/sunflower-seed.png'
  cheese: null,       // → '/assets/cheese-tile.png'
  background: null,   // → '/assets/cheese-warehouse-bg.jpg'
};

// null이면 CSS/SVG 폴백 사용, 경로가 있으면 해당 에셋 사용
export function getAsset(path) {
  const keys = path.split('.');
  let val = ASSETS;
  for (const k of keys) {
    val = val?.[k];
  }
  return val;
}

export default ASSETS;
