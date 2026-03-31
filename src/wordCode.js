// 형용사 64개 (6bit)
const ADJECTIVES = [
  '통통한', '졸린', '배고픈', '노란', '작은', '큰', '빠른', '느린',
  '귀여운', '뚱뚱한', '날씬한', '용감한', '겁많은', '행복한', '슬픈', '화난',
  '반짝이는', '몽글몽글', '포근한', '시원한', '따뜻한', '차가운', '달콤한', '짭짤한',
  '부드러운', '딱딱한', '말랑한', '쫀득한', '바삭한', '촉촉한', '보송한', '폭신한',
  '깜찍한', '수줍은', '당당한', '조용한', '시끄러운', '느긋한', '부지런한', '게으른',
  '똑똑한', '엉뚱한', '심심한', '신나는', '무서운', '든든한', '허전한', '배부른',
  '잠꾸러기', '먹보', '장난꾸러기', '울보', '웃는', '찡그린', '멍때리는', '뛰어다니는',
  '숨은', '빛나는', '동글동글', '길쭉한', '납작한', '알록달록', '새하얀', '까만',
];

// 명사 64개 (6bit)
const NOUNS = [
  '햄스터', '고양이', '치즈', '해바라기', '양말', '코끼리', '토끼', '강아지',
  '판다', '펭귄', '오리', '다람쥐', '여우', '곰돌이', '사자', '호랑이',
  '도넛', '쿠키', '마카롱', '푸딩', '케이크', '빵', '떡볶이', '김밥',
  '구름', '별', '달', '무지개', '꽃', '나무', '버섯', '선인장',
  '모자', '안경', '장갑', '목도리', '우산', '가방', '신발', '리본',
  '로봇', '우주선', '자전거', '기차', '비행기', '배', '풍선', '연',
  '피아노', '기타', '북', '나팔', '종', '호루라기', '탬버린', '하모니카',
  '젤리', '사탕', '초콜릿', '아이스크림', '솜사탕', '팝콘', '감자칩', '붕어빵',
];

// 난이도 접두어 (3종)
const DIFF_PREFIX = { easy: '쉬움', medium: '보통', hard: '어려움' };
const DIFF_REVERSE = { '쉬움': 'easy', '보통': 'medium', '어려움': 'hard' };

// 시드(최대 2^31) → 형용사+명사 조합 (12bit = 4096가지, 나머지는 숫자 접미)
// 포맷: "난이도-형용사 명사 숫자"
// 예: "쉬움-통통한 햄스터 42"
export function seedToWords(seed, difficulty) {
  const adj = seed % 64;
  const noun = Math.floor(seed / 64) % 64;
  const suffix = Math.floor(seed / 4096);
  const prefix = DIFF_PREFIX[difficulty] || '쉬움';
  return `${prefix}-${ADJECTIVES[adj]} ${NOUNS[noun]} ${suffix}`;
}

export function wordsToSeed(code) {
  try {
    const [diffPart, rest] = code.split('-');
    const difficulty = DIFF_REVERSE[diffPart.trim()];
    if (!difficulty) return null;

    const parts = rest.trim().split(/\s+/);
    if (parts.length < 3) return null;

    const adj = parts[0];
    const noun = parts[1];
    const suffix = parseInt(parts[2], 10);

    const adjIdx = ADJECTIVES.indexOf(adj);
    const nounIdx = NOUNS.indexOf(noun);
    if (adjIdx === -1 || nounIdx === -1 || isNaN(suffix)) return null;

    const seed = adjIdx + nounIdx * 64 + suffix * 4096;
    return { difficulty, seed };
  } catch {
    return null;
  }
}
