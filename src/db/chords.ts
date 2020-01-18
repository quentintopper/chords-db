import { Key } from "./keys";
import { Suffix } from "./suffixes";

export interface Position {
  frets: string,
  fingers: string,
  barres?: number | number[],
  capo?: boolean,
}

export interface Chord {
  key: Key,
  suffix: Suffix,
  positions: Position[],
}

export type Chords = Record<string, Chord[]>;