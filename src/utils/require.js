// @flow
'use strict';

var Module = require('module');
var path = require('path');

class Options {
    appendPaths: string[];
    prependPaths: string[];
    constructor(optsObj: Object = {}) {
        this.appendPaths = optsObj.appendPaths || [];
        this.prependPaths = optsObj.prependPaths || [];
    }
}

function requireFromString(code: string, filename: string = '', optsObj: Options) {
    const options = new Options(optsObj);

    if (typeof code !== 'string') {
        throw new Error('code must be a string, not ' + typeof code);
    }

    var paths = Module._nodeModulePaths(path.dirname(filename));

    var m = new Module(filename, module.parent);
    m.filename = filename;
    m.paths = [].concat(options.prependPaths).concat(paths).concat(options.appendPaths);
    m._compile(code, filename);

    return m;
}

module.exports = requireFromString;
