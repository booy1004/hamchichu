import { useState, useCallback, useRef, useEffect } from 'react';

const TOTAL_TIME = 120; // 2분

// PC: 10행 16열, 모바일: 16행 10열
function getLayout() {
  if (typeof window !== 'undefined' && window.innerWidth <= 600) {
    return { rows: 16, cols: 10 };
  }
  return { rows: 10, cols: 16 };
}

// 파프리카 종류: null=없음, green=2점, yellow=3점, orange=4점, red=5점
const PAPRIKA_TYPES = [null, 'green', 'yellow', 'orange', 'red'];
const PAPRIKA_POINTS = { null: 1, green: 2, yellow: 3, orange: 4, red: 5 };

const PAPRIKA_RATES = [0.60, 0.15, 0.12, 0.08, 0.05];

// 시드 기반 난수 (mulberry32)
function seededRandom(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generateSeed() {
  return Math.floor(Math.random() * 2147483647);
}

function pickPaprika(rand) {
  const r = rand();
  let cum = 0;
  for (let i = 0; i < PAPRIKA_RATES.length; i++) {
    cum += PAPRIKA_RATES[i];
    if (r < cum) return PAPRIKA_TYPES[i];
  }
  return null;
}

function createBoard(seed) {
  const { rows, cols } = getLayout();
  const rand = seed != null ? seededRandom(seed) : Math.random;
  const board = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        number: Math.floor(rand() * 9) + 1,
        paprika: pickPaprika(rand),
        alive: true,
      });
    }
    board.push(row);
  }
  return board;
}

export default function useAppleLogic() {
  const layout = getLayout();
  const [board, setBoard] = useState(() => createBoard());
  const [gameState, setGameState] = useState('ready'); // ready | playing | ended
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [currentSeed, setCurrentSeed] = useState(null);
  const [rows] = useState(layout.rows);
  const [cols] = useState(layout.cols);

  // 드래그 박스 (셀 좌표)
  const [dragStart, setDragStart] = useState(null); // {r, c}
  const [dragEnd, setDragEnd] = useState(null);     // {r, c}

  // 모바일 탭 모드: 첫 탭 → tapFirst, 두 번째 탭 → 사각형 판정
  const [tapFirst, setTapFirst] = useState(null); // {r, c}

  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          timerRef.current = null;
          setGameState('ended');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  // 드래그 박스 안의 살아있는 셀들 가져오기
  const getBoxCells = useCallback((start, end) => {
    if (!start || !end) return [];
    const minR = Math.min(start.r, end.r);
    const maxR = Math.max(start.r, end.r);
    const minC = Math.min(start.c, end.c);
    const maxC = Math.max(start.c, end.c);
    const cells = [];
    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        if (board[r]?.[c]?.alive) {
          cells.push({ r, c, cell: board[r][c] });
        }
      }
    }
    return cells;
  }, [board]);

  // 박스 안 합계
  const getBoxSum = useCallback(() => {
    const cells = getBoxCells(dragStart, dragEnd);
    return cells.reduce((sum, { cell }) => sum + cell.number, 0);
  }, [getBoxCells, dragStart, dragEnd]);

  // 드래그 시작
  const onDragStart = useCallback((r, c) => {
    if (gameState === 'ended') return;
    if (gameState === 'ready') {
      setGameState('playing');
      startTimer();
    }
    setDragStart({ r, c });
    setDragEnd({ r, c });
  }, [gameState, startTimer]);

  // 드래그 중
  const onDragMove = useCallback((r, c) => {
    if (!dragStart || gameState === 'ended') return;
    setDragEnd({ r, c });
  }, [dragStart, gameState]);

  // 드래그 끝
  const onDragEnd = useCallback(() => {
    if (!dragStart || !dragEnd) {
      setDragStart(null);
      setDragEnd(null);
      return;
    }

    const cells = getBoxCells(dragStart, dragEnd);
    const sum = cells.reduce((s, { cell }) => s + cell.number, 0);

    if (sum === 10 && cells.length > 0) {
      setBoard(prev => {
        const newBoard = prev.map(row => row.map(cell => ({ ...cell })));
        for (const { r, c } of cells) {
          newBoard[r][c] = { ...newBoard[r][c], alive: false };
        }
        return newBoard;
      });

      const basePoints = cells.length;
      const bonusPoints = cells.reduce((s, { cell }) => {
        return s + (PAPRIKA_POINTS[cell.paprika] - 1);
      }, 0);
      setScore(prev => prev + basePoints + bonusPoints);
    }

    setDragStart(null);
    setDragEnd(null);
  }, [dragStart, dragEnd, getBoxCells]);

  // 모바일 탭 모드: 셀 탭
  const onTapCell = useCallback((r, c) => {
    if (gameState === 'ended') return;
    if (gameState === 'ready') {
      setGameState('playing');
      startTimer();
    }

    if (!tapFirst) {
      // 첫 번째 탭
      setTapFirst({ r, c });
      setDragStart({ r, c });
      setDragEnd({ r, c });
    } else if (tapFirst.r === r && tapFirst.c === c) {
      // 같은 셀 다시 탭 → 취소
      setTapFirst(null);
      setDragStart(null);
      setDragEnd(null);
    } else {
      // 두 번째 탭 → 사각형 판정
      const start = tapFirst;
      const end = { r, c };
      const cells = getBoxCells(start, end);
      const sum = cells.reduce((s, { cell }) => s + cell.number, 0);

      if (sum === 10 && cells.length > 0) {
        setBoard(prev => {
          const newBoard = prev.map(row => row.map(cell => ({ ...cell })));
          for (const { r: cr, c: cc } of cells) {
            newBoard[cr][cc] = { ...newBoard[cr][cc], alive: false };
          }
          return newBoard;
        });

        const basePoints = cells.length;
        const bonusPoints = cells.reduce((s, { cell }) => {
          return s + (PAPRIKA_POINTS[cell.paprika] - 1);
        }, 0);
        setScore(prev => prev + basePoints + bonusPoints);

        setTapFirst(null);
        setDragStart(null);
        setDragEnd(null);
      } else {
        // 합이 10이 아니면 → 두 번째 셀을 새 첫 번째로
        setTapFirst({ r, c });
        setDragStart({ r, c });
        setDragEnd({ r, c });
      }
    }
  }, [gameState, tapFirst, getBoxCells, startTimer]);

  // 탭 모드에서 두 번째 셀 위에 호버(프리뷰)
  const onTapPreview = useCallback((r, c) => {
    if (!tapFirst) return;
    setDragStart(tapFirst);
    setDragEnd({ r, c });
  }, [tapFirst]);

  // 탭 취소
  const cancelTap = useCallback(() => {
    setTapFirst(null);
    setDragStart(null);
    setDragEnd(null);
  }, []);

  const resetGame = useCallback(() => {
    stopTimer();
    const seed = generateSeed();
    setBoard(createBoard(seed));
    setCurrentSeed(seed);
    setGameState('ready');
    setScore(0);
    setTimeLeft(TOTAL_TIME);
    setDragStart(null);
    setDragEnd(null);
    setTapFirst(null);
  }, [stopTimer]);

  // 대결 모드
  const startWithSeed = useCallback((seed) => {
    stopTimer();
    setBoard(createBoard(seed));
    setCurrentSeed(seed);
    setGameState('ready');
    setScore(0);
    setTimeLeft(TOTAL_TIME);
    setDragStart(null);
    setDragEnd(null);
    setTapFirst(null);
  }, [stopTimer]);

  const generateChallengeCode = useCallback(() => {
    const seed = currentSeed || generateSeed();
    setCurrentSeed(seed);
    const num = String(seed % 1000000).padStart(6, '0');
    return num;
  }, [currentSeed]);

  const parseChallengeCode = useCallback((code) => {
    const clean = code.trim();
    if (clean.length !== 6 || !/^\d{6}$/.test(clean)) return null;
    return { seed: parseInt(clean, 10) };
  }, []);

  return {
    board, gameState, score, timeLeft,
    rows, cols, tapFirst,
    dragStart, dragEnd, getBoxSum, getBoxCells,
    onDragStart, onDragMove, onDragEnd,
    onTapCell, onTapPreview, cancelTap,
    resetGame,
    startWithSeed, generateChallengeCode, parseChallengeCode,
    totalTime: TOTAL_TIME,
  };
}

export { PAPRIKA_POINTS };
