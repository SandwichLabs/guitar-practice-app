
import React from 'react';
import { CHORD_DIAGRAMS } from '../constants';
import type { ChordDefinition } from '../types';

interface ChordDiagramProps {
  chordName: string;
}

const FRET_COUNT = 5;
const STRING_COUNT = 6;
const FRET_HEIGHT = 40;
const STRING_SPACING = 30;
const PADDING = 20;
const DOT_RADIUS = 10;
const FRET_MARKER_RADIUS = 5;

const ChordDiagram: React.FC<ChordDiagramProps> = ({ chordName }) => {
  const chordData: ChordDefinition | undefined = CHORD_DIAGRAMS[chordName];
  
  const width = (STRING_COUNT - 1) * STRING_SPACING + 2 * PADDING;
  const height = FRET_COUNT * FRET_HEIGHT + 2 * PADDING;

  if (!chordData) {
    return (
      <div style={{ width, height }} className="bg-gray-700 border-2 border-gray-500 rounded-lg flex items-center justify-center">
        <span className="text-text-secondary">Chord '{chordName}' not found</span>
      </div>
    );
  }

  const renderStrings = () => {
    return Array.from({ length: STRING_COUNT }).map((_, i) => (
      <line
        key={`string-${i}`}
        x1={PADDING + i * STRING_SPACING}
        y1={PADDING}
        x2={PADDING + i * STRING_SPACING}
        y2={PADDING + FRET_COUNT * FRET_HEIGHT}
        stroke="#9ca3af"
        strokeWidth="1"
      />
    ));
  };

  const renderFrets = () => {
    return Array.from({ length: FRET_COUNT + 1 }).map((_, i) => (
      <line
        key={`fret-${i}`}
        x1={PADDING}
        y1={PADDING + i * FRET_HEIGHT}
        x2={PADDING + (STRING_COUNT - 1) * STRING_SPACING}
        y2={PADDING + i * FRET_HEIGHT}
        stroke="#9ca3af"
        strokeWidth={i === 0 ? "4" : "1"}
      />
    ));
  };
  
  const renderPositions = () => {
    return chordData.positions.map((pos, i) => {
      const stringIndex = STRING_COUNT - pos.string;
      const x = PADDING + stringIndex * STRING_SPACING;

      if (pos.fret === -1) { // Muted string
        return (
          <text key={`mute-${i}`} x={x} y={PADDING - 5} fontSize="16" fill="#ef4444" textAnchor="middle">X</text>
        );
      }
      if (pos.fret === 0) { // Open string
        return (
          <circle key={`open-${i}`} cx={x} cy={PADDING - 10} r={5} stroke="#f9fafb" strokeWidth="1" fill="none" />
        );
      }
      // Fretted note
      const y = PADDING + pos.fret * FRET_HEIGHT - FRET_HEIGHT / 2;
      return (
        <circle key={`dot-${i}`} cx={x} cy={y} r={DOT_RADIUS} fill="#f9fafb" />
      );
    });
  };

  const renderBarres = () => {
    return chordData.barres.map((barre, i) => {
      const startStringIndex = STRING_COUNT - barre.startString;
      const endStringIndex = STRING_COUNT - barre.endString;
      const x1 = PADDING + startStringIndex * STRING_SPACING;
      const x2 = PADDING + endStringIndex * STRING_SPACING;
      const y = PADDING + barre.fret * FRET_HEIGHT - FRET_HEIGHT / 2;

      return (
        <rect
          key={`barre-${i}`}
          x={x2}
          y={y - DOT_RADIUS / 1.5}
          width={x1-x2}
          height={DOT_RADIUS * 1.5}
          fill="#f9fafb"
          rx={DOT_RADIUS / 2}
        />
      )
    })
  }
  
  const renderFretMarkers = () => {
    const markers = [3, 5, 7, 9, 12];
    return markers.map(fret => {
        if (fret > FRET_COUNT) return null;
        const y = PADDING + fret * FRET_HEIGHT - FRET_HEIGHT / 2;
        const isDouble = fret === 12;
        return (
          <g key={`marker-${fret}`}>
            <circle cx={PADDING + (isDouble ? 1.5 : 2.5) * STRING_SPACING} cy={y} r={FRET_MARKER_RADIUS} fill="#4b5563" />
            {isDouble && <circle cx={PADDING + 3.5 * STRING_SPACING} cy={y} r={FRET_MARKER_RADIUS} fill="#4b5563" />}
          </g>
        )
    })
  }

  return (
    <div className="flex justify-center">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="bg-gray-700 rounded-lg border-2 border-gray-500">
        {renderFretMarkers()}
        {renderStrings()}
        {renderFrets()}
        {renderBarres()}
        {renderPositions()}
      </svg>
    </div>
  );
};

export default ChordDiagram;
