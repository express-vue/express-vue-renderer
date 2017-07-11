// @flow
const Models = require('../models');
const Parser = require('../parser');
const PathUtils = require('./checkPathUtils');

let types = new Models.Types();

function setupComponentArray(componentPath: string, defaults: Models.Defaults | Object) {
    return new Promise((resolve, reject) => {
        let array = [];
        let pathPromiseArray = [];
        PathUtils.getCorrectPathForFile(componentPath, defaults.viewsPath, 'view').then(path => {
            array.push(Parser.componentParser(path.path, defaults, types.COMPONENT));
            if (defaults.options.vue && defaults.options.vue.components) {
                for (let component of defaults.options.vue.components) {
                    pathPromiseArray.push(PathUtils.getCorrectPathForFile(component, defaults.componentsPath,'component'));
                }
            }
            Promise.all(pathPromiseArray)
                .then(pathObjArray => {
                    for (var pathObj of pathObjArray) {
                        array.push(Parser.componentParser(pathObj.path, defaults, types.SUBCOMPONENT));
                    }
                    resolve(array);
                })
                .catch(error => {
                    reject(error);
                });
        }).catch(error => {
            reject(error);
        });
    });

}

module.exports = setupComponentArray;
