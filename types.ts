export interface ChordPosition {
  fret: number;
  string: number;
}

export interface ChordBarre {
  fret: number;
  startString: number;
  endString: number;
}

export interface ChordDefinition {
  positions: ChordPosition[];
  barres: ChordBarre[];
}

export interface SongSection {
  id: string;
  name: string;
  chords: string[];
  repeats: number;
}

export interface PracticeConfiguration {
  bpm: number;
  sections: SongSection[];
  repeat: boolean;
}