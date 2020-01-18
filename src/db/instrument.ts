import { Tunings } from "./tunings";
import { Keys, Key } from "./keys";
import { Suffix } from "./suffixes";
import { Chord, Chords } from "./chords";

export default interface Instrument {
  main: {
    strings: number,
    fretsOnChord: number,
    name: string,
  },
  tunings: Tunings,
  keys: Key[],
  suffixes: Suffix[],
  chords: Chords
}