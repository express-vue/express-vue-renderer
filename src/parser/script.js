// @flow
const {
    DataObject
} = require('../models');
const requireFromString = require('require-from-string');
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

function scriptParser(script: string, defaults: Object, type: string, regex: RegExp): Object | null {
    if (!regex) {
        regex = scriptRegex;
    }
    const options = {
        'presets': ['es2015']
    };
    const scriptArray = script.match(regex) || [];
    if (scriptArray.length === 0) {
        let error = `I had an error processing this script.\n${script}`;
        console.error(new Error(error));
        return null;
    }
    let scriptString = scriptArray[0].replace(regex, '$2');
    // caching for babel script string so time spent in babel is reduced
    let babelScript = '';
    defaults.cache.get(stringHash(scriptString), (error, cachedBabelScript) => {
        if (error) {
            // if get from cache errors log it but go on with babel so it doesn't brake the flow
            console.error(new Error(error));
            babelScript = babel.transform(scriptString, options);
        } else if (cachedBabelScript) {
            babelScript = cachedBabelScript;
        } else {
            babelScript = babel.transform(scriptString, options);
            // set the cache for the babel script string
            defaults.cache.set(stringHash(scriptString), babelScript, error => {
                if (error) {
                    console.error(new Error(error));
                }
            });
        }
    });

    let evalScript = requireFromString(babelScript.code);
    let finalScript = dataMerge(evalScript.default, defaults, type);
    return finalScript;
}

module.exports = scriptParser;
