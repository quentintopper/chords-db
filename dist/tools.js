var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
export var strChord2array = function (str) {
    return str
        .split('')
        .map(function (char) { return (char.toLowerCase() === 'x' ? -1 : parseInt(char, 16)); });
};
export var processString = function (strings) {
    return Array.isArray(strings) ? strings : strChord2array(strings);
};
var processbaseFret = function (frets) {
    return Math.max.apply(Math, frets) > 4 ? Math.min.apply(Math, frets.filter(function (f) { return f > 0; })) : 1;
};
var processBarres = function (barres, baseFret) {
    return barres
        ? (Array.isArray(barres) ? barres : [barres]).map(function (barre) {
            return baseFret > 1 ? barre - baseFret + 1 : barre;
        })
        : [];
};
var processFrets = function (frets, baseFret) {
    return frets.map(function (fret) {
        return baseFret > 1 ? (fret > 0 ? fret - baseFret + 1 : fret) : fret;
    });
};
var processFingers = function (fingers) { return (fingers ? processString(fingers) : []); };
var processPosition = function (position, tuning) {
    var frets = processString(position.frets);
    var baseFret = processbaseFret(frets);
    return __assign({}, position, { baseFret: processbaseFret(frets), barres: processBarres(position.barres, baseFret), fingers: processFingers(position.fingers), frets: processFrets(frets, baseFret), midi: chord2midi(frets, tuning) });
};
export var unique = function (arr) {
    return arr.filter(function (elem, pos, a) { return a.indexOf(elem) === pos; });
};
export var numberOfBarres = function (str) {
    return unique(str.split(''))
        .map(function (chr) {
        return str.match(new RegExp(chr, 'gi')) &&
            parseInt(chr, 10) > 0 &&
            str.match(new RegExp(chr, 'gi')).length > 1
            ? 1
            : 0;
    })
        .reduce(function (last, actual) { return actual + last; }, 0);
};
var processPositions = function (positions, tuning) {
    return positions.map(function (position) { return processPosition(position, tuning); });
};
var processChord = function (suffixes, tuning) {
    return suffixes.map(function (suffix) {
        return __assign({}, suffix, processPositions(suffix.positions, tuning));
    });
};
function foldr(list, initial, fn) {
    var acc = initial;
    list.forEach(function (item) {
        acc = fn(item, acc);
    });
    return acc;
}
var processChords = function (chords, tuning) {
    return __assign({}, foldr(Object.keys(chords), {}, function (chord, acc) {
        var _a;
        return __assign({}, acc, (_a = {}, _a[chord] = processChord(chords[chord], tuning), _a));
    }));
};
export var generate = function (instrument, tuning) {
    if (tuning === void 0) { tuning = 'standard'; }
    return __assign({}, instrument, { chords: processChords(instrument.chords, instrument.tunings[tuning]) });
};
var midiNumbers = [
    'C',
    'C#',
    'D',
    'D#',
    'E',
    'F',
    'F#',
    'G',
    'G#',
    'A',
    'A#',
    'B'
];
var midiNote = function (note) {
    return (parseInt(note[1], 10) + 1) * 12 + midiNumbers.indexOf(note[0]);
};
var string2midi = function (fret, string, tuning) {
    return fret >= 0 ? midiNote(tuning[string]) + fret : -1;
};
export var chord2midi = function (frets, tuning) {
    return frets
        .map(function (fret, string) { return string2midi(fret, string, tuning); })
        .filter(function (note) { return note > 0; });
};
export var getNoteFromMidiNumber = function (number) { return midiNumbers[number % 12]; };
