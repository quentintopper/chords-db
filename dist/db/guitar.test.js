/* global it, describe, expect */
import guitar from './guitar';
import { strChord2array, chord2midi, processString } from '../tools';
describe('Guitar Chords', function () {
    describe('Strings', function () {
        it('Should have 6 strings', function () { return expect(guitar.main.strings).toEqual(6); });
    });
    describe('Types', function () {
        guitar.suffixes.map(function (suffix) {
            return it("Type suffix " + suffix + " should have a description", function () {
                return expect(suffix).toBeDefined();
            });
        });
    });
    describe("Test Cmajor midi notes", function () {
        it("Should match [ 48, 52, 55, 60, 64 ]", function () {
            var Cmajor = guitar.chords.C.find(function (chord) { return chord.suffix === 'major'; });
            var midiNotes = chord2midi(processString(Cmajor.positions[0].frets), guitar.tunings['standard']);
            var CmajorNotes = [48, 52, 55, 60, 64];
            expect(JSON.stringify(midiNotes)).toEqual(JSON.stringify(CmajorNotes));
        });
    });
    Object.keys(guitar.chords).map(function (key) {
        return describe("Key " + key.replace('sharp', '#'), function () {
            var chords = guitar.chords[key];
            it("Should not have duplicated suffixes", function () {
                var seen = new Set();
                var duplicates = chords.some(function (chord) { return seen.size === seen.add(chord.suffix).size; });
                expect(duplicates).toBe(false);
            });
            chords.map(function (chord) {
                return describe("Suffix " + chord.key + chord.suffix, function () {
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
                                    1) + " position frets array should have 6 values", function () {
                                    return expect(frets.length).toEqual(6);
                                });
                                it("The " + (index +
                                    1) + " position frets array should have values lower than 16", function () {
                                    return expect(Math.max.apply(Math, frets)).toBeLessThan(16);
                                });
                                it("The " + (index +
                                    1) + " position frets array should have at most 4 fingers of distance", function () {
                                    return expect(Math.max.apply(Math, effectiveFrets) - Math.min.apply(Math, effectiveFrets)).toBeLessThanOrEqual(guitar.main.fretsOnChord);
                                });
                            });
                            if (position.fingers) {
                                describe("Fingers", function () {
                                    var fingers = Array.isArray(position.fingers)
                                        ? position.fingers
                                        : strChord2array(position.fingers);
                                    it("The " + (index +
                                        1) + " position fingers array should have 6 values", function () {
                                        return expect(fingers.length).toEqual(6);
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
                            if (position.barres) {
                                describe("Barres", function () {
                                    var barres = Array.isArray(position.barres)
                                        ? position.barres
                                        : [position.barres];
                                    barres.map(function (barre) {
                                        it("The position " + (index +
                                            1) + ", barre " + barre + " should have frets", function () {
                                            return expect(frets.indexOf(barre)).not.toEqual(-1);
                                        });
                                        it("The position " + (index +
                                            1) + ", barre " + barre + " should have two strings at least", function () {
                                            return expect(frets.indexOf(barre)).not.toEqual(frets.lastIndexOf(barre));
                                        });
                                    });
                                });
                            }
                        });
                    });
                });
            });
        });
    });
});
