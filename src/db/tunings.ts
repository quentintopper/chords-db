import { Note } from "./notes";

export type Tuning = Note[];

export type Tunings = Record<string, Tuning>;