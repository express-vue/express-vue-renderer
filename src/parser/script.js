// @flow
const {
    DataObject
} = require('../models');

const Utils = require('../utils');
const babel = require('babel-core');
const stringHash = require('string-hash');

const scriptRegex = /(<script.*?>)([\s\S]*?)(<\/script>)/gm;

function dataMerge(script: Object, defaults: Object, type: string): Object {
    let finalScript = {};
    for (var element in script) {
        if (script.hasOwnProperty(element)) {
            if (element === 'data') {
                let data = new DataObject(script.data(), defaults.options.data, type).data;
                finalScript[element] = () => data;
            } else {
                finalScript[element] = script[element];
            }
        }
    }
    return finalScript;
}

function scriptParser(script: string, defaults: Object, type: string, regex: RegExp): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!regex) {
            regex = scriptRegex;
        }
        if (!script) {
            reject(new Error('Missing Script block'));
        }
        const options = {
            'presets': ['es2015']
        };
        const scriptArray = script.match(regex) || [];
        if (scriptArray.length === 0) {
            let error = `I had an error processing this script.\n${script}`;
            reject(new Error(error));
        }
        let scriptString = scriptArray[0].replace(regex, '$2');
        // caching for babel script string so time spent in babel is reduced
        let babelScript = '';
        const cachedBabelScript = defaults.cache.get(stringHash(scriptString));
        if (cachedBabelScript) {
            babelScript = cachedBabelScript;
        } else {
            babelScript = babel.transform(scriptString, options);
            // set the cache for the babel script string
            defaults.cache.set(stringHash(scriptString), babelScript);
        }

        let evalScript = Utils.requireFromString(babelScript.code).exports;
        let finalScript = dataMerge(evalScript.default, defaults, type);
        resolve(finalScript);
    });
}

module.exports = scriptParser;
