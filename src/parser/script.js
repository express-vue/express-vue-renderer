// @flow
const {
    DataObject
} = require('../models');

const Utils = require('../utils');
const babel = require('babel-core');
const stringHash = require('string-hash');

type ScriptObjectType = {
    type: 'string',
    content: 'string',
    start: number,
    attrs: Object,
    end: number
 }

function dataMerge(script: Object, defaults: Object, type: string): Object {
    let finalScript = {};
    for (var element in script) {
        if (script.hasOwnProperty(element)) {
            if (element === 'data') {
                let data = new DataObject(script.data(), defaults.data, type).data;
                finalScript[element] = () => data;
            } else {
                finalScript[element] = script[element];
            }
        }
    }
    return finalScript;
}

function scriptParser(scriptObject: ScriptObjectType, defaults: Object, type: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!scriptObject && !scriptObject.content) {
            reject(new Error('Missing Script block'));
        } else {
            const options = {
                'presets': ['es2015']
            };
            // caching for babel script string so time spent in babel is reduced
            let babelScript = '';
            const cachedBabelScript = defaults.cache.get(stringHash(scriptObject.content));
            if (cachedBabelScript) {
                babelScript = cachedBabelScript;
            } else {
                babelScript = babel.transform(scriptObject.content, options);
                // set the cache for the babel script string
                defaults.cache.set(stringHash(scriptObject.content), babelScript);
            }

            let evalScript = Utils.requireFromString(babelScript.code).exports;
            let finalScript = dataMerge(evalScript.default, defaults, type);
            resolve(finalScript);
        }
    });
}

module.exports = scriptParser;
