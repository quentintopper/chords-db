import { generate } from './tools';
import db from './db';
import fs from 'fs';
import path from 'path';
var createDirIfNeeded = function () {
    return fs.existsSync(path.join(__dirname, '..', 'lib')) ||
        fs.mkdirSync(path.join(__dirname, '..', 'lib'));
};
var generateJSON = function (instrument) {
    return fs.writeFileSync(path.join(__dirname, '..', 'lib', instrument + ".json"), JSON.stringify(generate(db[instrument])));
};
var prettyObjectToJSON = function (obj) { return JSON.stringify(obj, null, 4); };
var getInstrumentsDB = function () {
    return Object.assign.apply(Object, Object.keys(db).map(function (instrument) {
        var _a;
        return (_a = {},
            _a[instrument] = generate(db[instrument]),
            _a);
    }));
};
var getNumberOfPositions = function (suffixes) {
    return suffixes.reduce(function (sum, suffix) { return sum + suffix.positions.length; }, 0);
};
var getNumberOfChords = function (chords) {
    return Object.keys(chords).reduce(function (sum, key) { return sum + getNumberOfPositions(chords[key]); }, 0);
};
var generateIndex = function (db) {
    fs.writeFileSync(path.join(__dirname, '..', 'lib', "instruments.json"), JSON.stringify(Object.assign.apply(Object, Object.keys(db).map(function (instrument) {
        var _a;
        return (_a = {},
            _a[instrument] = Object.assign(db[instrument].main, {
                numberOfChords: getNumberOfChords(db[instrument].chords)
            }),
            _a);
    }))));
    return true;
};
var processCommand = function (json) {
    return json
        ? createDirIfNeeded() &&
            generateIndex(db) &&
            Object.keys(db).map(function (instrument) { return generateJSON(instrument); })
        : console.log(prettyObjectToJSON(getInstrumentsDB()));
};
var json = process.argv.length > 2 && process.argv[2] === 'json';
processCommand(json);
