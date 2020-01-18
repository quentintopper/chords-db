import { Key } from "./keys";
import { Suffix } from "./suffixes";
export interface Position {
    frets: string;
    fingers: string;
    baseFret?: number;
    barres?: number | number[];
    capo?: boolean;
}
export interface Chord {
    key: Key;
    suffix: Suffix;
    positions: Position[];
}
export declare type Chords = Record<string, Chord[]>;
