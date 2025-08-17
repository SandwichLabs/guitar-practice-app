import React, { useState, useEffect } from 'react';
import { SongSection } from '../types';
import { TrashIcon } from './icons';

interface SongStructureInputProps {
  value: SongSection[];
  onChange: (value: SongSection[]) => void;
}

const SongStructureInput: React.FC<SongStructureInputProps> = ({ value: sections, onChange }) => {
  const [newChordValues, setNewChordValues] = useState<string[]>(() => sections.map(() => ''));

  useEffect(() => {
    if (newChordValues.length !== sections.length) {
      setNewChordValues(sections.map(() => ''));
    }
  }, [sections, newChordValues.length]);

  const handleSectionChange = (index: number, field: keyof Omit<SongSection, 'id' | 'chords'>, fieldValue: string) => {
    const newSections = [...sections];
    if (field === 'repeats') {
      const repeats = parseInt(fieldValue, 10);
      if (!isNaN(repeats) && repeats > 0) {
        newSections[index] = { ...newSections[index], repeats };
      } else if (fieldValue === '') {
        newSections[index] = { ...newSections[index], repeats: 1 };
      }
    } else {
      newSections[index] = { ...newSections[index], [field]: fieldValue };
    }
    onChange(newSections);
  };
  
  const handleNewChordChange = (index: number, text: string) => {
    const newValues = [...newChordValues];
    newValues[index] = text;
    setNewChordValues(newValues);
  };

  const addChord = (sectionIndex: number) => {
    const chordToAdd = (newChordValues[sectionIndex] || '').trim();
    if (!chordToAdd) return;

    const capitalizedChord = chordToAdd.charAt(0).toUpperCase() + chordToAdd.slice(1);

    const newSections = [...sections];
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      chords: [...newSections[sectionIndex].chords, capitalizedChord],
    };
    onChange(newSections);

    const newValues = [...newChordValues];
    newValues[sectionIndex] = '';
    setNewChordValues(newValues);
  };

  const handleKeyPress = (e: React.KeyboardEvent, sectionIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addChord(sectionIndex);
    }
  };

  const removeChord = (sectionIndex: number, chordIndex: number) => {
    const newSections = [...sections];
    const newChords = [...newSections[sectionIndex].chords];
    newChords.splice(chordIndex, 1);
    newSections[sectionIndex] = {
      ...newSections[sectionIndex],
      chords: newChords,
    };
    onChange(newSections);
  };

  const addSection = () => {
    onChange([
      ...sections,
      {
        id: new Date().toISOString() + Math.random(),
        name: `Section ${sections.length + 1}`,
        chords: [],
        repeats: 1,
      },
    ]);
  };

  const removeSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    onChange(newSections);
  };

  return (
    <div className="space-y-4">
       <label className="block text-sm font-medium text-text-secondary mb-2">
        Song Structure
      </label>
      {sections.map((section, index) => (
        <div key={section.id} className="p-3 bg-gray-900 rounded-md border border-gray-700 space-y-3">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={section.name}
              onChange={(e) => handleSectionChange(index, 'name', e.target.value)}
              placeholder="Section Name (e.g. Verse)"
              className="flex-grow bg-gray-800 border border-gray-600 rounded-md py-1 px-2 text-white focus:outline-none focus:ring-1 focus:ring-primary text-sm"
            />
             <input
              type="number"
              value={section.repeats}
              min="1"
              onChange={(e) => handleSectionChange(index, 'repeats', e.target.value)}
              className="w-16 text-center bg-gray-800 border border-gray-600 rounded-md py-1 px-2 text-white focus:outline-none focus:ring-1 focus:ring-primary text-sm"
            />
            <span className="text-xs text-text-secondary">time(s)</span>
            <button onClick={() => removeSection(index)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-700 rounded-full transition-colors">
              <TrashIcon />
            </button>
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 min-h-[34px] p-1 bg-gray-800 rounded-md border border-gray-600">
              {section.chords.map((chord, chordIndex) => (
                <div key={chordIndex} className="bg-primary text-white rounded-md px-2 py-1 text-sm font-medium flex items-center gap-1.5 animate-fade-in">
                  <span>{chord}</span>
                  <button 
                    onClick={() => removeChord(index, chordIndex)} 
                    className="flex items-center justify-center w-4 h-4 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
                    aria-label={`Remove ${chord} chord`}
                  >
                    <span className="text-white text-xs font-bold leading-none -mt-px">&times;</span>
                  </button>
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Add chord"
                value={newChordValues[index] || ''}
                onChange={(e) => handleNewChordChange(index, e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                className="flex-grow bg-gray-800 border border-gray-600 rounded-md py-1 px-2 text-white focus:outline-none focus:ring-1 focus:ring-primary text-sm"
              />
              <button 
                onClick={() => addChord(index)}
                className="px-4 bg-gray-700 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-lg font-bold"
                aria-label="Add chord"
              >
                +
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addSection}
        className="w-full text-sm py-2 px-4 rounded-md border border-dashed border-gray-600 text-text-secondary hover:bg-gray-700 hover:border-gray-500 transition-colors"
      >
        + Add Section
      </button>
    </div>
  );
};

export default SongStructureInput;