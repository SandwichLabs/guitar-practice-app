
import React from 'react';

interface BpmInputProps {
  value: number;
  onChange: (value: number) => void;
}

const BpmInput: React.FC<BpmInputProps> = ({ value, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  const increment = () => onChange(value + 1);
  const decrement = () => onChange(Math.max(1, value - 1));

  return (
    <div>
      <label htmlFor="bpm" className="block text-sm font-medium text-text-secondary mb-2">
        Beats Per Minute (BPM)
      </label>
      <div className="flex items-center">
        <button onClick={decrement} className="px-4 py-2 bg-gray-700 text-white rounded-l-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary">-</button>
        <input
          type="number"
          id="bpm"
          value={value}
          onChange={handleChange}
          className="w-full text-center bg-gray-900 text-white py-2 border-t border-b border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          min="1"
        />
        <button onClick={increment} className="px-4 py-2 bg-gray-700 text-white rounded-r-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary">+</button>
      </div>
    </div>
  );
};

export default BpmInput;
