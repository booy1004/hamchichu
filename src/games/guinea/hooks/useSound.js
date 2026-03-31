import { useRef, useCallback } from 'react';

const SOUND_PATH = '/435748__richerlandtv__guineapig.mp3';

export default function useSound() {
  const audioRef = useRef(null);

  const play = useCallback(() => {
    try {
      // 매번 새 Audio 인스턴스로 중첩 재생 가능
      const audio = new Audio(SOUND_PATH);
      audio.volume = 0.5;
      audio.play().catch(() => {});
      audioRef.current = audio;
    } catch {
      // 무시
    }
  }, []);

  return { play };
}
