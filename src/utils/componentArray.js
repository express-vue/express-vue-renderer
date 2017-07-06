// @flow
const Models = require('../models');
const Parser = require('../parser');
const PathUtils = require('./checkPathUtils');

let types = new Models.Types();

function setupComponentArray(componentPath: string, defaults: Models.Defaults) {
    return new Promise((resolve, reject) => {
        let array = [
            Parser.layoutParser(defaults.layoutPath, defaults, types.LAYOUT)
        ];
        let pathPromiseArray = [];

        PathUtils.getCorrectPathForFile(componentPath, 'view').then(path => {
            array.push(Parser.componentParser(path.path, defaults, types.COMPONENT));

            if (defaults.options.vue && defaults.options.vue.components) {
                for (let component of defaults.options.vue.components) {
                    const componentFile = defaults.componentsDir + component + '.vue';
                    pathPromiseArray.push(PathUtils.getCorrectPathForFile(componentFile, 'component'));
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
