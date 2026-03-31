import { useState, useCallback, useRef, useEffect } from 'react';
import { seedToWords, wordsToSeed } from '../wordCode';

const DIFFICULTIES = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
};

function createBoard(rows, cols) {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighborMines: 0,
    }))
  );
}

// 시드 기반 난수 생성기 (mulberry32)
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

function placeMines(board, rows, cols, mines, excludeR, excludeC, seed) {
  const rand = seed != null ? seededRandom(seed) : Math.random;
  const b = board.map(row => row.map(cell => ({ ...cell })));
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(rand() * rows);
    const c = Math.floor(rand() * cols);
    if (b[r][c].isMine) continue;
    if (Math.abs(r - excludeR) <= 1 && Math.abs(c - excludeC) <= 1) continue;
    b[r][c].isMine = true;
    placed++;
  }
  // calc neighbors
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (b[r][c].isMine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && b[nr][nc].isMine) count++;
        }
      }
      b[r][c].neighborMines = count;
    }
  }
  return b;
}

export default function useGameLogic(difficulty = 'easy') {
  const { rows, cols, mines } = DIFFICULTIES[difficulty];
  const [board, setBoard] = useState(() => createBoard(rows, cols));
  const [gameState, setGameState] = useState('ready'); // ready | playing | won | lost
  const [flagCount, setFlagCount] = useState(0);
  const [timer, setTimer] = useState(0);
  const [revealedCount, setRevealedCount] = useState(0);
  const [lastAction, setLastAction] = useState(null); // { type, row, col }
  const [currentSeed, setCurrentSeed] = useState(null);
  const timerRef = useRef(null);
  const firstClick = useRef(true);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // 승리 시 고양이(지뢰) 위치 공개
  useEffect(() => {
    if (gameState === 'won') {
      setBoard(prev => prev.map(row => row.map(cell => ({
        ...cell,
        isRevealed: cell.isMine ? true : cell.isRevealed,
      }))));
    }
  }, [gameState]);

  const startTimer = useCallback(() => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  }, []);

  const revealCell = useCallback((r, c) => {
    setBoard(prev => {
      const b = prev.map(row => row.map(cell => ({ ...cell })));
      let newRevealed = 0;
      const queue = [[r, c]];
      while (queue.length) {
        const [cr, cc] = queue.shift();
        if (cr < 0 || cr >= rows || cc < 0 || cc >= cols) continue;
        if (b[cr][cc].isRevealed || b[cr][cc].isFlagged) continue;
        b[cr][cc].isRevealed = true;
        newRevealed++;
        if (b[cr][cc].neighborMines === 0 && !b[cr][cc].isMine) {
          for (let dr = -1; dr <= 1; dr++)
            for (let dc = -1; dc <= 1; dc++)
              queue.push([cr + dr, cc + dc]);
        }
      }
      setRevealedCount(prev => {
        const total = prev + newRevealed;
        if (total >= rows * cols - mines) {
          setGameState('won');
          stopTimer();
        }
        return total;
      });
      return b;
    });
  }, [rows, cols, mines, stopTimer]);

  const handleClick = useCallback((r, c) => {
    if (gameState === 'won' || gameState === 'lost') return;

    setBoard(prev => {
      if (prev[r][c].isRevealed || prev[r][c].isFlagged) return prev;

      if (firstClick.current) {
        firstClick.current = false;
        const seed = currentSeed || generateSeed();
        setCurrentSeed(seed);
        const newBoard = placeMines(prev, rows, cols, mines, r, c, seed);
        setGameState('playing');
        startTimer();
        // reveal on new board
        const b = newBoard.map(row => row.map(cell => ({ ...cell })));
        let newRevealed = 0;
        const queue = [[r, c]];
        while (queue.length) {
          const [cr, cc] = queue.shift();
          if (cr < 0 || cr >= rows || cc < 0 || cc >= cols) continue;
          if (b[cr][cc].isRevealed || b[cr][cc].isFlagged) continue;
          b[cr][cc].isRevealed = true;
          newRevealed++;
          if (b[cr][cc].neighborMines === 0 && !b[cr][cc].isMine) {
            for (let dr = -1; dr <= 1; dr++)
              for (let dc = -1; dc <= 1; dc++)
                queue.push([cr + dr, cc + dc]);
          }
        }
        setRevealedCount(newRevealed);
        if (newRevealed >= rows * cols - mines) {
          setGameState('won');
          stopTimer();
        }
        setLastAction({ type: 'reveal', row: r, col: c });
        return b;
      }

      if (prev[r][c].isMine) {
        // game over - reveal all mines
        const b = prev.map(row => row.map(cell => ({
          ...cell,
          isRevealed: cell.isMine ? true : cell.isRevealed,
        })));
        setGameState('lost');
        stopTimer();
        setLastAction({ type: 'mine', row: r, col: c });
        return b;
      }

      setLastAction({ type: 'reveal', row: r, col: c });
      return prev; // will be handled by revealCell
    });

    // for non-first clicks on safe cells
    if (!firstClick.current) {
      setBoard(prev => {
        if (prev[r][c].isMine || prev[r][c].isRevealed || prev[r][c].isFlagged) return prev;
        return prev; // trigger revealCell
      });
      // actually reveal
      setTimeout(() => revealCell(r, c), 0);
    }
  }, [gameState, rows, cols, mines, startTimer, stopTimer, revealCell]);

  const handleRightClick = useCallback((r, c) => {
    if (gameState === 'won' || gameState === 'lost' || gameState === 'ready') return;
    setBoard(prev => {
      if (prev[r][c].isRevealed) return prev;
      const b = prev.map(row => row.map(cell => ({ ...cell })));
      b[r][c].isFlagged = !b[r][c].isFlagged;
      setFlagCount(f => b[r][c].isFlagged ? f + 1 : f - 1);
      setLastAction({ type: b[r][c].isFlagged ? 'flag' : 'unflag', row: r, col: c });
      return b;
    });
  }, [gameState]);

  // 코드(chord) - 이미 열린 숫자 칸 더블클릭 시, 주변 깃발 수가 숫자와 같으면 나머지 자동 오픈
  const handleDoubleClick = useCallback((r, c) => {
    if (gameState !== 'playing') return;

    setBoard(prev => {
      const cell = prev[r][c];
      if (!cell.isRevealed || cell.isMine || cell.neighborMines === 0) return prev;

      // 주변 깃발 수 세기
      let flagged = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && prev[nr][nc].isFlagged) {
            flagged++;
          }
        }
      }

      // 깃발 수가 숫자와 다르면 무시
      if (flagged !== cell.neighborMines) return prev;

      // 주변 미개봉 칸 열기
      const b = prev.map(row => row.map(c => ({ ...c })));
      let newRevealed = 0;
      let hitMine = false;

      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr, nc = c + dc;
          if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue;
          if (b[nr][nc].isRevealed || b[nr][nc].isFlagged) continue;

          if (b[nr][nc].isMine) {
            // 깃발을 잘못 놓았으면 게임 오버
            hitMine = true;
            b[nr][nc].isRevealed = true;
          } else {
            // BFS로 열기
            const queue = [[nr, nc]];
            while (queue.length) {
              const [cr, cc] = queue.shift();
              if (cr < 0 || cr >= rows || cc < 0 || cc >= cols) continue;
              if (b[cr][cc].isRevealed || b[cr][cc].isFlagged) continue;
              b[cr][cc].isRevealed = true;
              newRevealed++;
              if (b[cr][cc].neighborMines === 0 && !b[cr][cc].isMine) {
                for (let dr2 = -1; dr2 <= 1; dr2++)
                  for (let dc2 = -1; dc2 <= 1; dc2++)
                    queue.push([cr + dr2, cc + dc2]);
              }
            }
          }
        }
      }

      if (hitMine) {
        // 모든 지뢰 공개
        for (let rr = 0; rr < rows; rr++)
          for (let cc = 0; cc < cols; cc++)
            if (b[rr][cc].isMine) b[rr][cc].isRevealed = true;
        setGameState('lost');
        stopTimer();
        setLastAction({ type: 'mine', row: r, col: c });
      } else {
        setRevealedCount(prev => {
          const total = prev + newRevealed;
          if (total >= rows * cols - mines) {
            setGameState('won');
            stopTimer();
          }
          return total;
        });
        setLastAction({ type: 'chord', row: r, col: c });
      }

      return b;
    });
  }, [gameState, rows, cols, mines, stopTimer]);


  const resetGame = useCallback((newDifficulty) => {
    const d = DIFFICULTIES[newDifficulty || difficulty];
    stopTimer();
    setBoard(createBoard(d.rows, d.cols));
    setGameState('ready');
    setFlagCount(0);
    setTimer(0);
    setRevealedCount(0);
    setLastAction(null);
    setCurrentSeed(null);
    firstClick.current = true;
  }, [difficulty, stopTimer]);

  // 대결 모드: 시드로 게임 시작
  const startWithSeed = useCallback((seed, newDifficulty) => {
    const d = DIFFICULTIES[newDifficulty || difficulty];
    stopTimer();
    setBoard(createBoard(d.rows, d.cols));
    setGameState('ready');
    setFlagCount(0);
    setTimer(0);
    setRevealedCount(0);
    setLastAction(null);
    setCurrentSeed(seed);
    firstClick.current = true;
  }, [difficulty, stopTimer]);

  // 대결 코드 생성 (귀여운 단어 조합)
  const generateChallengeCode = useCallback(() => {
    const seed = currentSeed || generateSeed();
    setCurrentSeed(seed);
    return seedToWords(seed, difficulty);
  }, [currentSeed, difficulty]);

  // 대결 코드 파싱
  const parseChallengeCode = useCallback((code) => {
    return wordsToSeed(code);
  }, []);

  return {
    board, gameState, flagCount, timer, mines, rows, cols,
    lastAction, revealedCount, currentSeed,
    handleClick, handleRightClick, handleDoubleClick, resetGame,
    startWithSeed, generateChallengeCode, parseChallengeCode,
  };
}
