import { useCallback, useRef, useEffect } from 'react';

const BEATS_PER_MEASURE = 4;

interface UseMetronomeSoundsOptions {
  enabled: boolean;
  bpm: number;
}

export function useMetronomeSounds({ enabled, bpm }: UseMetronomeSoundsOptions) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const measureCountRef = useRef(0);
  const synthUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (enabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    return () => {
      // Cleanup audio context when component unmounts
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, [enabled]);

  // Play metronome tock sound
  const playTock = useCallback((isDownbeat: boolean) => {
    if (!enabled || !audioContextRef.current) return;

    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    // Different frequencies for downbeat vs regular beats
    oscillator.frequency.value = isDownbeat ? 1000 : 800;
    oscillator.type = 'sine';

    // Sharp attack and quick decay for "tock" sound
    const now = context.currentTime;
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    oscillator.start(now);
    oscillator.stop(now + 0.05);
  }, [enabled]);

  // Speak measure count
  const speakMeasure = useCallback((measureNumber: number) => {
    if (!enabled || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(measureNumber.toString());
    utterance.rate = Math.min(2.5, 1 + (bpm / 200)); // Faster speech for faster tempos
    utterance.pitch = 1.2;
    utterance.volume = 0.6;

    synthUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, [enabled, bpm]);

  // Main function to play sound for a beat
  const playBeat = useCallback((beat: number) => {
    if (!enabled) return;

    const isDownbeat = beat === 1;

    // Play tock sound
    playTock(isDownbeat);

    // Count measures on the downbeat
    if (isDownbeat) {
      measureCountRef.current += 1;
      speakMeasure(measureCountRef.current);
    }
  }, [enabled, playTock, speakMeasure]);

  // Reset measure count
  const reset = useCallback(() => {
    measureCountRef.current = 0;
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return {
    playBeat,
    reset,
  };
}
