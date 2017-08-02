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
        this.regex = /(require\(')([\w/.\d]*\.vue)('\))/igm;
        this.appendPaths = optsObj.appendPaths || [];
        this.prependPaths = optsObj.prependPaths || [];
    }
}

function getVueObject(componentPath: string, rootPath: string): Promise < Object > {
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
                    resolve(rendered);
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
            if (error.message.includes('Unexpected token')) {
                let vueComponentFileArray = options.regex.exec(code);

                if (vueComponentFileArray && vueComponentFileArray.length > 0) {
                    //found a vue component
                    const vueComponentFile = vueComponentFileArray[2] ? vueComponentFileArray[2] : null;
                    if (vueComponentFile) {
                        getVueObject(vueComponentFile, m.paths[0])
                            .then(rendered => {
                                const newCode = code.replace(options.regex, rendered.scriptStringRaw);
                                m._compile(newCode, filename);
                                resolve(m.exports.default);
                            })
                            .catch(error => reject(error));

                    } else {
                        reject(new Error('Couldnt require component from string: ' + error));
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
