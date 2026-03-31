// 난이도 코드
const DIFF_CODE = { easy: '1', medium: '2', hard: '3' };
const DIFF_REVERSE = { '1': 'easy', '2': 'medium', '3': 'hard' };

// 시드 → 6자리 코드 (난이도 1자리 + 시드 5자리)
// 예: "142857", "293751"
export function seedToWords(seed, difficulty) {
  const prefix = DIFF_CODE[difficulty] || '1';
  const num = String(seed % 100000).padStart(5, '0');
  return `${prefix}${num}`;
}

export function wordsToSeed(code) {
  try {
    const clean = code.trim().replace(/\s/g, '');
    if (clean.length !== 6 || !/^\d{6}$/.test(clean)) return null;

    const difficulty = DIFF_REVERSE[clean[0]];
    if (!difficulty) return null;

    const seed = parseInt(clean.slice(1), 10);
    return { difficulty, seed };
  } catch {
    return null;
  }
}
