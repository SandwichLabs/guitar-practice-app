import React, { useState, useCallback, useEffect } from 'react';
import BpmInput from './components/BpmInput';
import SongStructureInput from './components/ChordInput';
import Player from './components/Player';
import SaveLoadControls from './components/SaveLoadControls';
import type { SongSection, PracticeConfiguration } from './types';

const App: React.FC = () => {
  const [bpm, setBpm] = useState<number>(120);
  const [sections, setSections] = useState<SongSection[]>([
    { id: '1', name: 'Verse', chords: ['G', 'C', 'G', 'D'], repeats: 2 },
    { id: '2', name: 'Chorus', chords: ['Am', 'C', 'F', 'G'], repeats: 4 },
  ]);
  const [isPlayerVisible, setPlayerVisible] = useState<boolean>(false);
  const [repeat, setRepeat] = useState<boolean>(true);
  const [savedConfigs, setSavedConfigs] = useState<Record<string, PracticeConfiguration>>({});

  const LOCAL_STORAGE_KEY = 'guitarPracticeApp_configs';

  useEffect(() => {
    try {
      const storedConfigs = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedConfigs) {
        setSavedConfigs(JSON.parse(storedConfigs));
      }
    } catch (error) {
      console.error("Failed to load configurations from local storage", error);
    }
  }, []);

  const handleStart = () => {
    if (sections.some(s => s.chords.length > 0) && bpm > 0) {
      setPlayerVisible(true);
    }
  };

  const handleBack = useCallback(() => {
    setPlayerVisible(false);
  }, []);
  
  const handleSectionsChange = useCallback((newSections: SongSection[]) => {
    setSections(newSections);
  }, []);

  const handleBpmChange = useCallback((newBpm: number) => {
    setBpm(newBpm);
  }, []);

  const handleSave = useCallback((name: string, config: PracticeConfiguration) => {
    if (savedConfigs[name]) {
      if (!confirm(`A configuration named "${name}" already exists. Overwrite it?`)) {
        return;
      }
    }
    const newConfigs = { ...savedConfigs, [name]: config };
    setSavedConfigs(newConfigs);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newConfigs));
  }, [savedConfigs]);

  const handleLoad = useCallback((name: string) => {
    const config = savedConfigs[name];
    if (config) {
      setBpm(config.bpm);
      setSections(config.sections);
      setRepeat(config.repeat);
    }
  }, [savedConfigs]);

  const handleDelete = useCallback((name: string) => {
    if (confirm(`Are you sure you want to delete the "${name}" configuration?`)) {
      const newConfigs = { ...savedConfigs };
      delete newConfigs[name];
      setSavedConfigs(newConfigs);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newConfigs));
    }
  }, [savedConfigs]);

  const hasValidChords = sections.some(s => s.chords.length > 0);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
            Guitar Chord Practice App
          </h1>
          <p className="text-text-secondary mt-2 text-lg">
            Create and practice your own chord progressions
          </p>
        </header>

        <main className="bg-surface rounded-lg shadow-2xl p-6 md:p-8 transition-all duration-500">
          {isPlayerVisible ? (
            <Player bpm={bpm} sections={sections} onBack={handleBack} repeat={repeat} />
          ) : (
            <div className="space-y-6">
              <div>
                <BpmInput value={bpm} onChange={handleBpmChange} />
              </div>
              <div>
                <SongStructureInput value={sections} onChange={handleSectionsChange} />
              </div>
              <div className="flex items-center">
                <input
                  id="repeat"
                  type="checkbox"
                  checked={repeat}
                  onChange={(e) => setRepeat(e.target.checked)}
                  className="w-4 h-4 text-primary bg-gray-700 border-gray-600 rounded focus:ring-primary focus:ring-2 cursor-pointer"
                />
                <label htmlFor="repeat" className="ml-2 text-sm font-medium text-text-secondary cursor-pointer">
                  Repeat Progression
                </label>
              </div>
              
              <SaveLoadControls
                onSave={handleSave}
                onLoad={handleLoad}
                onDelete={handleDelete}
                savedConfigs={savedConfigs}
                currentConfig={{ bpm, sections, repeat }}
              />

              <div className="pt-2">
                <button
                  onClick={handleStart}
                  disabled={!hasValidChords || bpm <= 0}
                  className="w-full bg-primary hover:bg-primary-focus text-white font-bold py-3 px-4 rounded-lg text-lg transition-all duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                >
                  Start Practice
                </button>
              </div>
            </div>
          )}
        </main>
        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>Built for practicing rhythm and chord changes.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;