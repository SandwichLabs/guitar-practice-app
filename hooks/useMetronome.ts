
import { useState, useRef, useCallback, useEffect } from 'react';

const BEATS_PER_MEASURE = 4;

export const useMetronome = (bpm: number, onBeat: (beat: number) => void) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<number | null>(null);
  const beatRef = useRef<number>(0);
  const onBeatRef = useRef(onBeat);

  useEffect(() => {
    onBeatRef.current = onBeat;
  }, [onBeat]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
    beatRef.current = 0;
    onBeatRef.current(0); // Reset beat indicator
  }, []);

  const start = useCallback(() => {
    if (isPlaying || bpm <= 0) return;

    stop(); // Ensure any existing timer is cleared
    setIsPlaying(true);
    
    const interval = 60000 / bpm;
    
    // Initial beat
    beatRef.current = 1;
    onBeatRef.current(beatRef.current);

    timerRef.current = window.setInterval(() => {
      beatRef.current = (beatRef.current % BEATS_PER_MEASURE) + 1;
      onBeatRef.current(beatRef.current);
    }, interval);
  }, [bpm, isPlaying, stop]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return { isPlaying, start, stop };
};
