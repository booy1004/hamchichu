import { useState, useCallback } from 'react';

const STORAGE_KEY = 'hamster-minesweeper-records';

function loadRecords() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { easy: [], medium: [], hard: [] };
  } catch {
    return { easy: [], medium: [], hard: [] };
  }
}

function saveRecords(records) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export default function useRecords() {
  const [records, setRecords] = useState(loadRecords);

  const addRecord = useCallback((difficulty, time) => {
    const name = prompt('🐹 클리어! 이름을 입력해줘:') || '리쿠';
    const newRecord = {
      name,
      time,
      date: new Date().toLocaleDateString('ko-KR'),
    };

    setRecords(prev => {
      const updated = { ...prev };
      updated[difficulty] = [...(updated[difficulty] || []), newRecord]
        .sort((a, b) => a.time - b.time)
        .slice(0, 10); // 상위 10개만
      saveRecords(updated);
      return updated;
    });

    return name;
  }, []);

  const clearRecords = useCallback(() => {
    const empty = { easy: [], medium: [], hard: [] };
    setRecords(empty);
    saveRecords(empty);
  }, []);

  return { records, addRecord, clearRecords };
}
