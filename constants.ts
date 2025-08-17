
import type { ChordDefinition } from './types';

export const CHORD_DIAGRAMS: Record<string, ChordDefinition> = {
  'C': {
    positions: [
      { fret: -1, string: 6 },
      { fret: 3, string: 5 },
      { fret: 2, string: 4 },
      { fret: 0, string: 3 },
      { fret: 1, string: 2 },
      { fret: 0, string: 1 },
    ],
    barres: [],
  },
  'G': {
    positions: [
      { fret: 3, string: 6 },
      { fret: 2, string: 5 },
      { fret: 0, string: 4 },
      { fret: 0, string: 3 },
      { fret: 0, string: 2 },
      { fret: 3, string: 1 },
    ],
    barres: [],
  },
  'D': {
    positions: [
      { fret: -1, string: 6 },
      { fret: -1, string: 5 },
      { fret: 0, string: 4 },
      { fret: 2, string: 3 },
      { fret: 3, string: 2 },
      { fret: 2, string: 1 },
    ],
    barres: [],
  },
  'A': {
    positions: [
      { fret: -1, string: 6 },
      { fret: 0, string: 5 },
      { fret: 2, string: 4 },
      { fret: 2, string: 3 },
      { fret: 2, string: 2 },
      { fret: 0, string: 1 },
    ],
    barres: [],
  },
  'E': {
    positions: [
      { fret: 0, string: 6 },
      { fret: 2, string: 5 },
      { fret: 2, string: 4 },
      { fret: 1, string: 3 },
      { fret: 0, string: 2 },
      { fret: 0, string: 1 },
    ],
    barres: [],
  },
  'Am': {
    positions: [
      { fret: -1, string: 6 },
      { fret: 0, string: 5 },
      { fret: 2, string: 4 },
      { fret: 2, string: 3 },
      { fret: 1, string: 2 },
      { fret: 0, string: 1 },
    ],
    barres: [],
  },
  'Em': {
    positions: [
      { fret: 0, string: 6 },
      { fret: 2, string: 5 },
      { fret: 2, string: 4 },
      { fret: 0, string: 3 },
      { fret: 0, string: 2 },
      { fret: 0, string: 1 },
    ],
    barres: [],
  },
  'Dm': {
    positions: [
      { fret: -1, string: 6 },
      { fret: -1, string: 5 },
      { fret: 0, string: 4 },
      { fret: 2, string: 3 },
      { fret: 3, string: 2 },
      { fret: 1, string: 1 },
    ],
    barres: [],
  },
  'F': {
    positions: [],
    barres: [{ fret: 1, startString: 6, endString: 1 }],
  },
};
