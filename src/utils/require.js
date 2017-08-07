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
        this.vueFileRegex = /([\w/.\-_\d]*\.vue)/igm;
        this.requireRegex = /(require\(')([\w/.\-_\d]*\.vue)('\))/igm;
        this.appendPaths = optsObj.appendPaths || [];
        this.prependPaths = optsObj.prependPaths || [];
        this.rootPath = optsObj.rootPath || '';
        this.defaults = optsObj.defaults || {};
    }
}

function getVueObject(componentPath: string, rootPath: string, vueComponentFileMatch: string): Promise < {rendered:Object, match: string} > {
    const GlobalOptions = new Models.Defaults({
        rootPath: rootPath,
        component: componentPath
    });
    return new Promise((resolve, reject) => {
        Utils.setupComponent(componentPath, GlobalOptions)
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
    const parentMatches = code.match(/(require\('\.\.\/)/gm);
    const currentMatches = code.match(/(require\('\.\/)/gm);
    if (parentMatches) {
        for (const match of parentMatches) {
            code = code.replace(match, `require('${rootPath}/../`);
        }
    }
    if (currentMatches) {
        for (const match of currentMatches) {
            code = code.replace(match, `require('${rootPath}/./`);
        }
    }

    return code;
}


function requireFromString(code: string, filename: string = '', optsObj: Object = {}): Promise < Object > {
    return new Promise((resolve, reject) => {
        const options = new Options(optsObj);

        if (typeof code !== 'string') {
            throw new Error('code must be a string, not ' + typeof code);
        }
        code = replaceRelativePaths(code, options.rootPath);
        let paths = Module._nodeModulePaths(path.dirname(filename));
        var m = new Module(filename, options.rootPath);
        m.filename = filename;
        m.paths = [].concat(options.prependPaths).concat(paths).concat(options.appendPaths);
        try {
            m._compile(code, filename);
            resolve(m.exports.default);
        } catch (error) {
            //Check if the error is because the file isn't javascript
            if (error.message.includes('Unexpected token')) {
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
                            getVueObject(vueComponentFile[0], options.rootPath, vueComponentFileMatch)
                                .then(renderedItem => {
                                    const rawString = renderedItem.rendered.scriptStringRaw;
                                    code = code.replace(renderedItem.match, rawString);
                                    //check if its the last element and then render
                                    const last_element = code.match(options.requireRegex);
                                    if (last_element === undefined || last_element === null) {
                                        m._compile(code, filename);
                                        resolve(m.exports.default);
                                    }
                                })
                                .catch(error => {
                                    reject(error);
                                });
                        }
                    }
                } else {
                    reject(new Error('Couldnt require component from string: ' + error));
                }
            } else {
                reject(new Error('Couldnt require from string: ' + error));
            }
        }
    });
}

module.exports = requireFromString;
