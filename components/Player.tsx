import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useMetronome } from '../hooks/useMetronome';
import { useMetronomeSounds } from '../hooks/useMetronomeSounds';
import ChordDiagram from './ChordDiagram';
import { PlayIcon, PauseIcon, StopIcon } from './icons';
import type { SongSection } from '../types';

interface PlayerProps {
  bpm: number;
  sections: SongSection[];
  onBack: () => void;
  repeat: boolean;
}

interface PlayerState {
  sectionIndex: number;
  chordIndex: number;
  repetition: number;
}

const Player: React.FC<PlayerProps> = ({ bpm, sections, onBack, repeat }) => {
  const [beat, setBeat] = useState<number>(0);
  const [playerState, setPlayerState] = useState<PlayerState>({
    sectionIndex: 0,
    chordIndex: 0,
    repetition: 1,
  });
  const [metronomeEnabled, setMetronomeEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem('guitarPracticeApp_metronomeEnabled');
    return stored ? JSON.parse(stored) : true;
  });
  const isFirstBeatRef = useRef(true);

  const onBeatCallback = useCallback((currentBeat: number) => {
    setBeat(currentBeat);
    if (currentBeat !== 1) return;

    if (isFirstBeatRef.current) {
      isFirstBeatRef.current = false;
      return;
    }

    setPlayerState(prev => {
      let { sectionIndex, chordIndex, repetition } = prev;
      const currentSection = sections[sectionIndex];
      
      chordIndex++;

      if (chordIndex >= currentSection.chords.length) {
        chordIndex = 0;
        repetition++;
      }

      if (repetition > currentSection.repeats) {
        repetition = 1;
        sectionIndex++;
      }

      if (sectionIndex >= sections.length) {
        if (repeat) {
          sectionIndex = 0;
          chordIndex = 0;
          repetition = 1;
        } else {
          return { ...prev, sectionIndex };
        }
      }
      
      return { sectionIndex, chordIndex, repetition };
    });
  }, [sections, repeat]);

  const { isPlaying, start, stop } = useMetronome(bpm, onBeatCallback);
  const { playBeat, reset: resetSounds } = useMetronomeSounds({ enabled: metronomeEnabled, bpm });
  
  const isSongFinished = playerState.sectionIndex >= sections.length;

  // Play metronome sound on beat change
  useEffect(() => {
    if (beat > 0 && isPlaying) {
      playBeat(beat);
    }
  }, [beat, isPlaying, playBeat]);

  // Save metronome preference to localStorage
  useEffect(() => {
    localStorage.setItem('guitarPracticeApp_metronomeEnabled', JSON.stringify(metronomeEnabled));
  }, [metronomeEnabled]);

  useEffect(() => {
    if (isSongFinished && isPlaying) {
      stop();
      isFirstBeatRef.current = true;
    }
  }, [isSongFinished, isPlaying, stop]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      stop();
      isFirstBeatRef.current = true;
    } else if (!isSongFinished) {
      start();
    }
  }

  const handleStop = () => {
    stop();
    resetSounds();
    setPlayerState({ sectionIndex: 0, chordIndex: 0, repetition: 1 });
    isFirstBeatRef.current = true;
    setBeat(0);
  };

  const getNextChordDisplay = () => {
    if (isSongFinished) return 'End';
    
    let { sectionIndex, chordIndex, repetition } = playerState;
    const currentSection = sections[sectionIndex];

    if (chordIndex + 1 < currentSection.chords.length) {
      return currentSection.chords[chordIndex + 1];
    }
    if (repetition < currentSection.repeats) {
      return currentSection.chords[0];
    }
    if (sectionIndex + 1 < sections.length) {
      return sections[sectionIndex + 1].chords[0] || 'End';
    }
    if (repeat) {
      return sections[0]?.chords[0] || 'End';
    }
    return 'End';
  };

  const currentSection = sections[playerState.sectionIndex];
  const currentChord = currentSection?.chords[playerState.chordIndex] || '...';
  const nextChord = getNextChordDisplay();
  const sectionDisplay = currentSection ? `${currentSection.name} (${playerState.repetition}/${currentSection.repeats})` : 'Finished';

  return (
    <div className="flex flex-col items-center text-center">

      <div className="relative w-full mb-2">
        <button onClick={onBack} className="absolute top-0 left-0 text-text-secondary hover:text-primary transition-colors">&larr; Back to Setup</button>
        <div className="text-right">
          <div className="text-sm text-text-secondary mb-2">BPM: {bpm}</div>
          <div className="flex items-center justify-end">
            <input
              id="metronome-toggle"
              type="checkbox"
              checked={metronomeEnabled}
              onChange={(e) => setMetronomeEnabled(e.target.checked)}
              className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2 cursor-pointer"
            />
            <label htmlFor="metronome-toggle" className="ml-2 text-xs font-medium text-text-secondary cursor-pointer">
              Metronome Sound
            </label>
          </div>
        </div>
      </div>
      
      <div className="h-8 mb-2">
        <h2 className="text-xl font-semibold text-text-secondary tracking-wide">{sectionDisplay}</h2>
      </div>

      <div className="grid grid-cols-3 items-center w-full mb-6">
          <div className="text-left">
              {/* Placeholder */}
          </div>
          <div className="text-6xl font-bold text-primary tracking-wider">{currentChord}</div>
          <div className="text-right">
            <span className="text-text-secondary text-lg">Next</span>
            <p className="text-2xl font-semibold text-text-primary">{nextChord}</p>
          </div>
      </div>
      
      <div className="w-full max-w-xs mx-auto mb-8">
          <ChordDiagram chordName={currentChord} />
      </div>

      <div className="flex space-x-4 mb-8">
        {[1, 2, 3, 4].map(b => (
          <div
            key={b}
            className={`w-8 h-8 rounded-full transition-all duration-150 ${
              beat === b ? 'bg-primary animate-pulse-beat' : 'bg-gray-600'
            } ${
              b === 1 && beat === 1 ? 'bg-amber-400' : ''
            }`}
          />
        ))}
      </div>

      <div className="flex items-center space-x-6">
        <button onClick={handleStop} className="p-3 bg-gray-700 rounded-full hover:bg-gray-600 transition-colors text-red-500">
          <StopIcon className="w-8 h-8"/>
        </button>
        <button 
          onClick={handleTogglePlay}
          disabled={isSongFinished}
          className="p-4 bg-primary rounded-full hover:bg-primary-focus transition-colors text-white shadow-lg transform hover:scale-110 disabled:bg-gray-600 disabled:scale-100"
        >
          {isPlaying ? <PauseIcon className="w-10 h-10"/> : <PlayIcon className="w-10 h-10"/>}
        </button>
        <div className="w-14"></div>
      </div>
    </div>
  );
};

export default Player;
