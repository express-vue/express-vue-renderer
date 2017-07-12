// @flow
const fs = require('fs');
const path = require('path');
const Defaults = require('../models').Defaults;
const paramCase = require('param-case');
const stringHash = require('string-hash');

function getParamCasePath(path: string): string {
    // example /Users/foo/code/test/components/componentFile.vue
    let pathArr = path.split('/');

    // gets the last element componentFile.foo
    let fileName = pathArr[pathArr.length - 1];

    // gets the actual file name componentFile
    let newFileName = fileName.split('.vue')[0];

    // paramcases componentFile to component-file and adds. .vue at the end
    let paramCaseFile = paramCase(newFileName) + '.vue';

    // replaces last element of the array, with the param'd version of the filename
    pathArr[pathArr.length - 1] = paramCaseFile;

    // returns joined pathname with slashes
    return pathArr.join('/').toString();
}


function getCorrectPathForFile(filePath: string, rootPath: string, type: string, defaults: Defaults) {
    return new Promise((resolve, reject) => {
        const resolvedPath = path.join(rootPath, filePath);
        const cacheKey = stringHash('resolvedPath-' + resolvedPath);
        const cachedResolvedPath = defaults.cache.get(cacheKey);
        if (cachedResolvedPath) {
            resolve(cachedResolvedPath);
        } else {
            fs.access(resolvedPath, fs.constants.F_OK | fs.constants.R_OK, (error) => {
                if (error) {
                    if (error.code === 'ENOENT') {
                        fs.access(getParamCasePath(resolvedPath), fs.constants.F_OK | fs.constants.R_OK, (err) => {
                            let paramCasePath = '';
                            if (err) {
                                reject(new Error(`Could not find ${type} file at ${paramCasePath.length > 0 ? paramCasePath : resolvedPath}`));
                            } else {
                                paramCasePath = getParamCasePath(resolvedPath);
                                resolve({path: paramCasePath, type: type});
                            }
                        });
                    }
                } else {
                    const pathObject = {path: resolvedPath, type: type};
                    defaults.cache.set(cacheKey, pathObject);

                    resolve(pathObject);
                }
            });
        }
    });
}

module.exports.getParamCasePath = getParamCasePath;
module.exports.getCorrectPathForFile = getCorrectPathForFile;
