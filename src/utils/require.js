// @flow
'use strict';

var Module = require('module');
var path = require('path');

type Opts = {
    appendPaths: string[];
    prependPaths: string[]
}

function requireFromString(code: string, filename: string = '', opts: Opts = {}) {
    if (typeof filename === 'object') {
        opts = filename;
        filename = undefined;
    }

    opts.appendPaths = opts.appendPaths || [];
    opts.prependPaths = opts.prependPaths || [];

    if (typeof code !== 'string') {
        throw new Error('code must be a string, not ' + typeof code);
    }

    var paths = Module._nodeModulePaths(path.dirname(filename));

    var m = new Module(filename, module.parent);
    m.filename = filename;
    m.paths = [].concat(opts.prependPaths).concat(paths).concat(opts.appendPaths);
    m._compile(code, filename);

    return m;
}

module.exports = requireFromString;
