import { useState, useCallback } from 'react';

const STORAGE_KEY = 'guinea-pig-paprika-records';

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

export default function useGuineaRecords() {
  const [records, setRecords] = useState(loadRecords);

  const addRecord = useCallback((difficulty, score, maxCombo) => {
    const name = prompt('🐹 뿌이뿌이~ 이름을 입력해줘:') || '사쿠야';
    const newRecord = {
      name,
      score,
      maxCombo,
      date: new Date().toLocaleDateString('ko-KR'),
    };

    setRecords(prev => {
      const updated = { ...prev };
      updated[difficulty] = [...(updated[difficulty] || []), newRecord]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
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
