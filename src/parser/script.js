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

function scriptParser(scriptObject: ScriptObjectType, defaults: Object, type: string): Promise < Object > {
    return new Promise((resolve, reject) => {
        if (!scriptObject && !scriptObject.content) {
            reject(new Error('Missing Script block'));
        } else {
            const options = {
                'presets': ['es2015']
            };
            // caching for babel script string so time spent in babel is reduced
            const cacheKey = stringHash(scriptObject.content);
            const cachedBabelScript = defaults.cache.get(cacheKey);
            if (cachedBabelScript) {
                let finalScript = dataMerge(cachedBabelScript, defaults, type);

                //FUCK THIS _Ctor property fuck this fucking thing
                //fuck you you fucking fuckstick i cant believe this
                //is the offical vue-loader fix

                if (finalScript.components) {
                    for (var component in finalScript.components) {
                        if (finalScript.components.hasOwnProperty(component)) {
                            delete finalScript.components[component]._Ctor;
                        }
                    }
                }
                resolve(finalScript);
            } else {
                const babelScript = babel.transform(scriptObject.content, options);
                // const filename = path.join(defaults.rootPath, '/', defaults.component);
                const requireFromStringOptions = {
                    rootPath: defaults.rootPath
                };
                Utils.requireFromString(babelScript.code, defaults.component, requireFromStringOptions)
                    .then(scriptFromString => {
                        // set the cache for the babel script string
                        defaults.cache.set(cacheKey, scriptFromString);

                        let finalScript = dataMerge(scriptFromString, defaults, type);
                        resolve(finalScript);
                    })
                    .catch(error => reject(error));
            }

        }
    });
}

module.exports = scriptParser;
