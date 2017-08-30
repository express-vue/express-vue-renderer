// @flow
const Module = require('module');
const path = require('path');
const Utils = require('./index');
const Renderer = require('../renderer');
const Models = require('../models');

class Options {
    vueFileRegex: RegExp;
    requireRegex: RegExp;
    appendPaths: string[];
    prependPaths: string[];
    rootPath: string;
    defaults: Models.Defaults;
    constructor(optsObj: Object) {
        this.vueFileRegex = /([\w/.\-@_\d]*\.vue)/igm;
        this.requireRegex = /(require\(['"])([\w/.\-@_\d]*\.vue)(['"]\))/igm;
        this.appendPaths = optsObj.appendPaths || [];
        this.prependPaths = optsObj.prependPaths || [];
        this.rootPath = optsObj.rootPath || '';
        this.defaults = optsObj.defaults;
    }
}

function getVueObject(componentPath: string, rootPath: string, vueComponentFileMatch: string, Cache: Object): Promise < {rendered:Object, match: string} > {
    const GlobalOptions = new Models.Defaults({
        rootPath: rootPath,
        component: componentPath
    });
    return new Promise((resolve, reject) => {
        Utils.setupComponent(componentPath, GlobalOptions, Cache)
            .then(component => {
                const rendered = Renderer.renderHtmlUtil(component);
                if (!rendered) {
                    reject(new Error('Renderer Error'));
                } else {
                    resolve({
                        rendered: rendered,
                        match: vueComponentFileMatch
                    });
                }
            }).catch((error) => {
                reject(error);
            });
    });
}

function replaceRelativePaths(code: string, rootPath: string): string {
    const parentMatchesSingle = code.match(/(require\('\.\.\/)/gm);
    const currentMatchesSingle = code.match(/(require\('\.\/)/gm);
    const parentMatchesDouble = code.match(/(require\("\.\.\/)/gm);
    const currentMatchesDouble = code.match(/(require\("\.\/)/gm);
    if (parentMatchesSingle) {
        for (const match of parentMatchesSingle) {
            code = code.replace(match, `require('${rootPath}/../`);
        }
    }
    if (parentMatchesDouble) {
        for (const match of parentMatchesDouble) {
            code = code.replace(match, `require("${rootPath}/../`);
        }
    }
    if (currentMatchesSingle) {
        for (const match of currentMatchesSingle) {
            code = code.replace(match, `require('${rootPath}/./`);
        }
    }
    if (currentMatchesDouble) {
        for (const match of currentMatchesDouble) {
            code = code.replace(match, `require("${rootPath}/./`);
        }
    }

    return code;
}


function requireFromString(code: string, filename: string = '', optsObj: Object = {}, Cache: Object): Promise < Object > {
    return new Promise((resolve, reject) => {
        const options = new Options(optsObj);
        let promiseArray = [];

        if (typeof code !== 'string') {
            throw new Error('code must be a string, not ' + typeof code);
        }
        code = replaceRelativePaths(code, options.rootPath);
        let paths = Module._nodeModulePaths(path.dirname(filename));
        var m = new Module(filename, options.rootPath);
        m.filename = filename;
        m.paths = [].concat(options.prependPaths).concat(paths).concat(options.appendPaths);

        //find matches for the require paths
        let vueComponentFileMatches = code.match(options.requireRegex);
        if (vueComponentFileMatches && vueComponentFileMatches.length > 0) {
            //iterate through the matches
            for (var index = 0; index < vueComponentFileMatches.length; index++) {
                var vueComponentFileMatch = vueComponentFileMatches[index];
                //get the file out of the require string
                //this is because its easier to do string replace later
                const vueComponentFile = vueComponentFileMatch.match(options.vueFileRegex);
                if (vueComponentFile && vueComponentFile.length > 0) {
                    promiseArray.push(getVueObject(vueComponentFile[0], options.rootPath, vueComponentFileMatch, Cache));
                }
            }
            Promise.all(promiseArray)
                .then(renderedItemArray => {
                    let styles = '';
                    for (var renderedItem of renderedItemArray) {
                        const rawString = renderedItem.rendered.scriptStringRaw;
                        code = code.replace(renderedItem.match, rawString);
                        if (renderedItem.rendered.layout && renderedItem.rendered.layout.style) {
                            styles += renderedItem.rendered.layout.style;
                        }
                    }
                    //check if its the last element and then render
                    const last_element = code.match(options.vueFileRegex);
                    if (last_element === undefined || last_element === null) {
                        m._compile(code, filename);
                        m.exports.default.styles = styles;
                        resolve(m.exports.default);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        } else {
            m._compile(code, filename);
            resolve(m.exports.default);
        }
    });
}

module.exports = requireFromString;
