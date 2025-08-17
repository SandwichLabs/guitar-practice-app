import React, { useState } from 'react';
import type { PracticeConfiguration } from '../types';
import { TrashIcon } from './icons';

interface SaveLoadControlsProps {
  currentConfig: PracticeConfiguration;
  savedConfigs: Record<string, PracticeConfiguration>;
  onSave: (name: string, config: PracticeConfiguration) => void;
  onLoad: (name: string) => void;
  onDelete: (name: string) => void;
}

const SaveLoadControls: React.FC<SaveLoadControlsProps> = ({
  currentConfig,
  savedConfigs,
  onSave,
  onLoad,
  onDelete,
}) => {
  const [newName, setNewName] = useState('');

  const handleSaveClick = () => {
    if (newName.trim()) {
      onSave(newName.trim(), currentConfig);
      setNewName('');
    } else {
      alert('Please enter a name for the configuration.');
    }
  };

  const configNames = Object.keys(savedConfigs);

  return (
    <div className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-900">
      <h3 className="text-lg font-medium text-text-secondary">Configurations</h3>
      
      <div className="space-y-2">
        <label htmlFor="config-name" className="block text-sm font-medium text-text-secondary">
          Save Current Setup
        </label>
        <div className="flex space-x-2">
          <input
            id="config-name"
            type="text"
            placeholder="Configuration Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="flex-grow bg-gray-800 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <button
            onClick={handleSaveClick}
            className="bg-primary hover:bg-primary-focus text-white font-bold py-2 px-4 rounded-md text-sm transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      {configNames.length > 0 && (
        <div className="space-y-2 pt-2">
          <label className="block text-sm font-medium text-text-secondary">
            Load Saved Setup
          </label>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-2">
            {configNames.sort().map((name) => (
              <div key={name} className="flex items-center justify-between bg-surface p-2 rounded-md">
                <span className="text-text-primary truncate" title={name}>{name}</span>
                <div className="flex space-x-2 flex-shrink-0">
                  <button
                    onClick={() => onLoad(name)}
                    className="text-sm py-1 px-3 rounded-md border border-gray-600 text-text-secondary hover:bg-gray-700 hover:border-gray-500 transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => onDelete(name)}
                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-700 rounded-full transition-colors"
                    aria-label={`Delete ${name}`}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SaveLoadControls;