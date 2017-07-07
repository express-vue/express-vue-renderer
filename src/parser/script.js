// @flow
const {DataObject} = require('../models');
const requireFromString = require('require-from-string');

const scriptRegex = /(<script.*?>)([\s\S]*?)(<\/script>)/gm;

function dataParser(script: Object, defaults: Object, type: string): Object{
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
    let scriptString  = scriptArray[0].replace(regex, '$2');
    let babelScript   = require('babel-core').transform(scriptString, options);
    let evalScript    = requireFromString(babelScript.code);
    let finalScript   = dataParser(evalScript.default, defaults, type);
    return finalScript;
}

module.exports = scriptParser;
