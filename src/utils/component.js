// @flow
const Models = require('../models');
const Parser = require('../parser');
const PathUtils = require('./checkPathUtils');

let types = new Models.Types();

function setupComponent(componentPath: string, defaults: Models.Defaults) {
    return new Promise((resolve, reject) => {
        const vueFile = componentPath.includes('.vue') ? componentPath : componentPath + '.vue';
        PathUtils.getCorrectPathForFile(vueFile, defaults.viewsPath, 'view', defaults)
            .then(path => {
                Parser.componentParser(path.path, defaults, types.COMPONENT)
                    .then(component => {
                        resolve(component);
                    })
                    .catch(error => {
                        reject(error);
                    });
            })
            .catch(error => {
                reject(error);
            });
    });

}

module.exports = setupComponent;
