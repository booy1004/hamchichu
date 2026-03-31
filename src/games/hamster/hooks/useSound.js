import { useCallback, useRef, useState } from 'react';

// Base64 인코딩된 초짧은 WAV 생성 (코드로 사운드 파일 자체를 만듦)
function createWav(samples, sampleRate = 22050) {
  const numSamples = samples.length;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  // WAV 헤더
  const writeStr = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(44 + i * 2, s * 0x7FFF, true);
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

// 사운드 생성 함수들
function generateEatSound() {
  const rate = 22050;
  const dur = 0.25;
  const samples = new Float32Array(rate * dur);
  for (let i = 0; i < samples.length; i++) {
    const t = i / rate;
    const env = Math.exp(-t * 12);
    // 쫩쫩 - 여러 짧은 톤 연타
    const chirp1 = Math.sin(2 * Math.PI * 900 * t) * (t < 0.06 ? 1 : 0);
    const chirp2 = Math.sin(2 * Math.PI * 1000 * t) * (t > 0.06 && t < 0.12 ? 1 : 0);
    const chirp3 = Math.sin(2 * Math.PI * 950 * t) * (t > 0.12 && t < 0.18 ? 1 : 0);
    const chirp4 = Math.sin(2 * Math.PI * 1100 * t) * (t > 0.18 ? 1 : 0);
    samples[i] = (chirp1 + chirp2 + chirp3 + chirp4) * env * 0.4;
  }
  return createWav(samples, rate);
}

function generateFlagSound() {
  const rate = 22050;
  const dur = 0.12;
  const samples = new Float32Array(rate * dur);
  for (let i = 0; i < samples.length; i++) {
    const t = i / rate;
    const env = Math.exp(-t * 25);
    samples[i] = Math.sin(2 * Math.PI * 1200 * t) * env * 0.35;
  }
  return createWav(samples, rate);
}

function generateUnflagSound() {
  const rate = 22050;
  const dur = 0.12;
  const samples = new Float32Array(rate * dur);
  for (let i = 0; i < samples.length; i++) {
    const t = i / rate;
    const env = Math.exp(-t * 25);
    const freq = 800 - t * 3000; // 하강
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.3;
  }
  return createWav(samples, rate);
}

function generateCatSound() {
  const rate = 22050;
  const dur = 0.6;
  const samples = new Float32Array(rate * dur);
  for (let i = 0; i < samples.length; i++) {
    const t = i / rate;
    const env = Math.exp(-t * 4);
    // 애옹 - 톱니파 글라이드 다운
    const freq = 900 - t * 1200;
    const saw = ((freq * t) % 1) * 2 - 1;
    samples[i] = saw * env * 0.25;
  }
  return createWav(samples, rate);
}

function generateShockSound() {
  const rate = 22050;
  const dur = 0.3;
  const samples = new Float32Array(rate * dur);
  for (let i = 0; i < samples.length; i++) {
    const t = i / rate;
    const env = Math.exp(-t * 8);
    // 끼이익 - 고주파 상승 후 하강
    const freq = 1500 + Math.sin(t * 30) * 500;
    const sq = Math.sign(Math.sin(2 * Math.PI * freq * t));
    samples[i] = sq * env * 0.15;
  }
  return createWav(samples, rate);
}

function generateClearSound() {
  const rate = 22050;
  const dur = 0.8;
  const samples = new Float32Array(rate * dur);
  const notes = [523, 659, 784, 1047]; // C E G C
  for (let i = 0; i < samples.length; i++) {
    const t = i / rate;
    const noteIdx = Math.min(Math.floor(t / 0.15), 3);
    const noteT = t - noteIdx * 0.15;
    const env = Math.exp(-noteT * 5);
    samples[i] = Math.sin(2 * Math.PI * notes[noteIdx] * t) * env * 0.3;
  }
  return createWav(samples, rate);
}

function generateChordSound() {
  const rate = 22050;
  const dur = 0.2;
  const samples = new Float32Array(rate * dur);
  for (let i = 0; i < samples.length; i++) {
    const t = i / rate;
    const env = Math.exp(-t * 15);
    const freq = 600 + t * 1000; // 상승
    samples[i] = Math.sin(2 * Math.PI * freq * t) * env * 0.25;
  }
  return createWav(samples, rate);
}

export default function useSound() {
  const [muted, setMuted] = useState(false);
  const mutedRef = useRef(false);
  const soundsRef = useRef(null);

  // 사운드 URL을 한번만 생성
  const getSounds = useCallback(() => {
    if (!soundsRef.current) {
      soundsRef.current = {
        eat: generateEatSound(),
        flag: generateFlagSound(),
        unflag: generateUnflagSound(),
        cat: generateCatSound(),
        shock: generateShockSound(),
        clear: generateClearSound(),
        chord: generateChordSound(),
      };
    }
    return soundsRef.current;
  }, []);

  const play = useCallback((name, volume = 0.5) => {
    if (mutedRef.current) return;
    try {
      const sounds = getSounds();
      const audio = new Audio(sounds[name]);
      audio.volume = volume;
      audio.play().catch(() => {});
    } catch {}
  }, [getSounds]);

  const toggleMute = useCallback(() => {
    setMuted(prev => {
      mutedRef.current = !prev;
      return !prev;
    });
  }, []);

  const playEat = useCallback(() => play('eat', 0.5), [play]);
  const playFlag = useCallback(() => play('flag', 0.4), [play]);
  const playUnflag = useCallback(() => play('unflag', 0.3), [play]);
  const playCat = useCallback(() => play('cat', 0.5), [play]);
  const playShock = useCallback(() => play('shock', 0.4), [play]);
  const playClear = useCallback(() => play('clear', 0.6), [play]);
  const playChord = useCallback(() => play('chord', 0.4), [play]);
  const playClick = useCallback(() => play('flag', 0.2), [play]);

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
