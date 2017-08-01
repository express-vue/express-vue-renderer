// @flow
const Models = require('../models');
const Parser = require('../parser');
const PathUtils = require('./checkPathUtils');

let types = new Models.Types();

function setupComponentArray(componentPath: string, defaults: Models.Defaults) {
    return new Promise((resolve, reject) => {
        let array = [];
        const vueFile = componentPath.includes('.vue') ? componentPath : componentPath + '.vue';
        PathUtils.getCorrectPathForFile(vueFile, defaults.viewsPath, 'view', defaults)
            .then(path => {
                array.push(Parser.componentParser(path.path, defaults, types.COMPONENT));
                resolve(array);
            })
            .catch(error => {
                reject(error);
            });
    });

}

module.exports = setupComponentArray;
