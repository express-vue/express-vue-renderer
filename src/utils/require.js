// @flow
const Module = require('module');
const path = require('path');
const Utils = require('./index');
const Renderer = require('../renderer');
const Models = require('../models');

class Options {
    regex: RegExp;
    appendPaths: string[];
    prependPaths: string[];
    constructor(optsObj: Object) {
        this.vueFileRegex = /([\w/.\-_\d]*\.vue)/igm;
        this.requireRegex = /(require\(')([\w/.\-_\d]*\.vue)('\))/igm;
        this.appendPaths = optsObj.appendPaths || [];
        this.prependPaths = optsObj.prependPaths || [];
    }
}

function getVueObject(componentPath: string, rootPath: string, vueComponentFileMatch: string): Promise < Object > {
    const GlobalOptions = new Models.Defaults({
        viewsPath: rootPath
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


function requireFromString(code: string, filename: string = '', optsObj: Object = {}): Promise < Object > {
    return new Promise((resolve, reject) => {
        const options = new Options(optsObj);

        if (typeof code !== 'string') {
            throw new Error('code must be a string, not ' + typeof code);
        }

        var paths = Module._nodeModulePaths(path.dirname(filename));

        var m = new Module(filename, module.parent);
        m.filename = filename;
        m.paths = [].concat(options.prependPaths).concat(paths).concat(options.appendPaths);
        try {
            m._compile(code, filename);
            resolve(m.exports.default);
        } catch (error) {
            //Check if the error is because the file isn't javascript
            if (error.message.includes('Unexpected token')) {
                //Copy the code for string manip
                let newCode = code;
                //find matches for the require paths
                let vueComponentFileMatches = code.match(options.requireRegex);
                if (vueComponentFileMatches && vueComponentFileMatches.length > 0) {
                    //setup last element of the match
                    const last_element = vueComponentFileMatches[vueComponentFileMatches.length - 1];
                    //iterate through the matches
                    for (const vueComponentFileMatch of vueComponentFileMatches) {
                        //get the file out of the require string
                        //this is because its easier to do string replace later
                        const vueComponentFile = vueComponentFileMatch.match(options.vueFileRegex)[0];
                        getVueObject(vueComponentFile, m.paths[0], vueComponentFileMatch)
                            .then(renderedItem => {
                                const rawString = renderedItem.rendered.scriptStringRaw;
                                newCode = newCode.replace(renderedItem.match, rawString);
                                //check if its the last element and then render
                                if (vueComponentFileMatch === last_element) {
                                    m._compile(newCode, filename);
                                    resolve(m.exports.default);
                                }
                            })
                            .catch(error => {
                                reject(error);
                            });
                    }
                } else {
                    reject(new Error('Couldnt require component from string: ' + error));
                }
            } else {
                reject(new Error('Couldnt require component from string: ' + error));
            }
        }
    });
}

module.exports = requireFromString;
