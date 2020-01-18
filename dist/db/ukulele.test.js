/* global it, describe, expect */
import ukulele from './ukulele';
import { strChord2array, chord2midi, processString, numberOfBarres, unique, getNoteFromMidiNumber } from '../tools';
describe('ukulele Chords', function () {
    describe('Strings', function () {
        it('Should have 4 strings', function () { return expect(ukulele.main.strings).toEqual(4); });
    });
    describe('Types', function () {
        ukulele.suffixes.map(function (suffix) {
            return it("Type suffix " + suffix + " should have a description", function () {
                return expect(suffix).toBeDefined();
            });
        });
    });
    describe("Test Cmajor midi notes", function () {
        it("Should match [ 67, 60, 64, 72 ]", function () {
            var Cmajor = ukulele.chords.C.find(function (chord) { return chord.suffix === 'major'; });
            var midiNotes = chord2midi(processString(Cmajor.positions[0].frets), ukulele.tunings['standard']);
            var CmajorNotes = [67, 60, 64, 72];
            expect(JSON.stringify(midiNotes)).toEqual(JSON.stringify(CmajorNotes));
        });
    });
    Object.keys(ukulele.chords).map(function (key) {
        return describe("Key " + key + " chords", function () {
            var chords = ukulele.chords[key];
            it("Should not have duplicated suffixes", function () {
                var seen = new Set();
                var duplicates = chords.some(function (chord) { return seen.size === seen.add(chord.suffix).size; });
                expect(duplicates).toBe(false);
            });
            chords.map(function (chord) {
                return describe("Chord " + chord.key + chord.suffix, function () {
                    describe('General properties', function () {
                        it("The chord " + key + chord.suffix + " should have a defined key property", function () {
                            return expect(chord.key).toEqual(key.replace('sharp', '#'));
                        });
                        it("The chord " + key + chord.suffix + " should have a defined suffix property", function () {
                            return expect(chord.suffix).toBeDefined();
                        });
                        it("The chord " + key + chord.suffix + " should have a list of positions", function () {
                            return expect(chord.positions).toBeInstanceOf(Array);
                        });
                    });
                    describe("Positions", function () {
                        chord.positions.map(function (position, index) {
                            var frets = Array.isArray(position.frets)
                                ? position.frets
                                : strChord2array(position.frets);
                            var effectiveFrets = frets.filter(function (f) { return f > 0; });
                            describe("Frets", function () {
                                it("The " + (index +
                                    1) + " position frets array should have 4 values", function () {
                                    return expect(frets.length).toEqual(4);
                                });
                                it("The " + (index +
                                    1) + " position frets array should have values lower than 16", function () {
                                    return expect(Math.max.apply(Math, frets)).toBeLessThan(16);
                                });
                                it("The " + (index +
                                    1) + " position frets array should have at most 4 fingers of distance", function () {
                                    return expect(Math.max.apply(Math, effectiveFrets) - Math.min.apply(Math, effectiveFrets)).toBeLessThan(ukulele.main.fretsOnChord);
                                });
                            });
                            if (position.fingers) {
                                describe("Fingers", function () {
                                    var fingers = Array.isArray(position.fingers)
                                        ? position.fingers
                                        : strChord2array(position.fingers);
                                    it("The " + (index +
                                        1) + " position fingers array should have 4 values", function () {
                                        return expect(fingers.length).toEqual(4);
                                    });
                                    it("The " + (index +
                                        1) + " position fingers array should have values lower than 5", function () {
                                        return expect(Math.max.apply(Math, fingers)).toBeLessThan(5);
                                    });
                                    it("The " + (index +
                                        1) + " position fingers array should have values higher or equal to 0", function () {
                                        return expect(Math.min.apply(Math, fingers)).toBeGreaterThanOrEqual(0);
                                    });
                                });
                            }
                            describe("Barres", function () {
                                if (position.fingers && !position.barres) {
                                    it("The " + (index + 1) + " position needs a barres property", function () {
                                        return expect(numberOfBarres(position.fingers)).toEqual(0);
                                    });
                                }
                                if (!position.barres) {
                                    it("The " + (index +
                                        1) + " position doesn't need a capo property", function () {
                                        return expect(position.capo).not.toEqual(true);
                                    });
                                }
                                if (position.barres) {
                                    var barres_1 = Array.isArray(position.barres)
                                        ? position.barres
                                        : [position.barres];
                                    if (position.fingers) {
                                        it("The " + (index +
                                            1) + " position needs a barres property", function () {
                                            return expect(numberOfBarres(position.fingers)).toEqual(barres_1.length);
                                        });
                                    }
                                    barres_1.map(function (barre) {
                                        it("The barre at position " + (index +
                                            1) + " should have frets", function () {
                                            return expect(frets.indexOf(barre)).not.toEqual(-1);
                                        });
                                        it("The barre at position " + (index +
                                            1) + " should have two strings at least", function () {
                                            return expect(frets.indexOf(barre)).not.toEqual(frets.lastIndexOf(barre));
                                        });
                                    });
                                }
                            });
                        });
                        describe('MIDI checks', function () {
                            var initialNotes = chord2midi(processString(chord.positions[0].frets), ukulele.tunings['standard']).map(function (n) { return getNoteFromMidiNumber(n); });
                            chord.positions.map(function (position, index) {
                                it("The MIDI notes should be homogeneous at position " + (index +
                                    1), function () {
                                    var notes = chord2midi(processString(position.frets), ukulele.tunings['standard']).map(function (n) { return getNoteFromMidiNumber(n); });
                                    expect(unique(notes.sort())).toEqual(unique(initialNotes.sort()));
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
