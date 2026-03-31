import { useCallback, useRef, useState, useEffect } from 'react';

// Web Audio API로 귀여운 효과음 합성
export default function useSound() {
  const ctxRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      mutedRef.current = !prev;
      return !prev;
    });
  }, []);

  // 모바일: 첫 유저 인터랙션에서 AudioContext 초기화
  useEffect(() => {
    const initAudio = () => {
      if (!ctxRef.current) {
        ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (ctxRef.current.state === 'suspended') {
        ctxRef.current.resume();
      }
      // 무음 재생으로 모바일 오디오 잠금 해제
      const osc = ctxRef.current.createOscillator();
      const gain = ctxRef.current.createGain();
      gain.gain.value = 0; // 무음
      osc.connect(gain);
      gain.connect(ctxRef.current.destination);
      osc.start();
      osc.stop(ctxRef.current.currentTime + 0.01);

      // 한번만 실행
      document.removeEventListener('touchstart', initAudio);
      document.removeEventListener('click', initAudio);
    };

    document.addEventListener('touchstart', initAudio, { once: true });
    document.addEventListener('click', initAudio, { once: true });

    return () => {
      document.removeEventListener('touchstart', initAudio);
      document.removeEventListener('click', initAudio);
    };
  }, []);

  const getCtx = useCallback(() => {
    if (mutedRef.current) return null;
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (ctxRef.current.state === 'suspended') {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  // 기본 음 재생 헬퍼
  const playTone = useCallback((freq, duration, type = 'sine', volume = 0.3, detune = 0) => {
    try {
      const ctx = getCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.detune.value = detune;
      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch {
      // 오디오 실패 시 무시
    }
  }, [getCtx]);

  // 노이즈 버스트 (쫩 소리용)
  const playNoise = useCallback((duration = 0.05, volume = 0.15) => {
    try {
      const ctx = getCtx();
      if (!ctx) return;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2000;
      filter.Q.value = 2;
      gain.gain.value = volume;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    } catch {}
  }, [getCtx]);

  // 🧀 치즈 먹기 - 쫩쫩 챱챱 (높은 톤 연타)
  const playEat = useCallback(() => {
    const baseFreq = 800 + Math.random() * 200;
    playTone(baseFreq, 0.08, 'sine', 0.25);
    setTimeout(() => playTone(baseFreq + 100, 0.08, 'sine', 0.2), 60);
    setTimeout(() => {
      playTone(baseFreq + 50, 0.06, 'sine', 0.2);
      playNoise(0.03, 0.08);
    }, 120);
    setTimeout(() => playTone(baseFreq + 150, 0.1, 'sine', 0.15), 180);
  }, [playTone, playNoise]);

  // 🌻 해바라기씨 설치 - 톡!
  const playFlag = useCallback(() => {
    playTone(1200, 0.1, 'sine', 0.2);
    setTimeout(() => playTone(900, 0.08, 'sine', 0.15), 50);
    playNoise(0.02, 0.1);
  }, [playTone, playNoise]);

  // 🌻 해바라기씨 제거 - 뽁
  const playUnflag = useCallback(() => {
    playTone(600, 0.1, 'sine', 0.15);
    setTimeout(() => playTone(400, 0.08, 'sine', 0.1), 50);
  }, [playTone]);

  // 🐱 고양이 발견 - 애옹! (글라이드 다운 + 노이즈)
  const playCat = useCallback(() => {
    try {
      const ctx = getCtx();
      if (!ctx) return;
      // 애옹 메인 톤
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);

      // 두번째 애옹
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(700, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.5);
        gain2.gain.setValueAtTime(0.15, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.6);
      }, 300);
    } catch {}
  }, [getCtx]);

  // 😱 리쿠 놀람 - 끼이익! (고주파 짧은 비명)
  const playShock = useCallback(() => {
    try {
      const ctx = getCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1500, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2500, ctx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {}
  }, [getCtx]);

  // 🎉 클리어 - 빠빠빠빵! (상승 멜로디)
  const playClear = useCallback(() => {
    const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
    notes.forEach((freq, i) => {
      setTimeout(() => playTone(freq, 0.3, 'sine', 0.2), i * 150);
    });
    // 마지막에 반짝 효과
    setTimeout(() => {
      playTone(1047, 0.5, 'sine', 0.15);
      playTone(1319, 0.5, 'sine', 0.1);
    }, 600);
  }, [playTone]);

  // 빈 칸 연쇄 오픈 - 퐁퐁퐁 (부드러운 연쇄음)
  const playChord = useCallback(() => {
    playTone(600, 0.15, 'sine', 0.15);
    setTimeout(() => playTone(700, 0.12, 'sine', 0.12), 80);
    setTimeout(() => playTone(800, 0.1, 'sine', 0.1), 160);
  }, [playTone]);

  // 버튼 클릭 - 딸깍
  const playClick = useCallback(() => {
    playTone(1000, 0.05, 'sine', 0.1);
  }, [playTone]);

  return {
    playEat,
    playFlag,
    playUnflag,
    playCat,
    playShock,
    playClear,
    playChord,
    playClick,
    muted,
    toggleMute,
  };
}
