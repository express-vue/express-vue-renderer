// @flow
const Models = require('../models');
const Parser = require('../parser');
const PathUtils = require('./checkPathUtils');

let types = new Models.Types();

function setupComponentArray(componentPath: string, defaults: Models.Defaults) {
    return new Promise((resolve, reject) => {
        let array = [];
        let pathPromiseArray = [];
        const vueFile = componentPath.includes('.vue') ? componentPath : componentPath + '.vue';
        PathUtils.getCorrectPathForFile(vueFile, defaults.viewsPath, 'view', defaults)
            .then(path => {
                array.push(Parser.componentParser(path.path, defaults, types.COMPONENT));
                if (defaults.vue && defaults.vue.components) {
                    for (let component of defaults.vue.components) {
                        const componentFile = component.includes('.vue') ? component : component + '.vue';
                        pathPromiseArray.push(PathUtils.getCorrectPathForFile(componentFile, defaults.componentsPath ,'component', defaults));
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
            })
            .catch(error => {
                reject(error);
            });
    });

}

module.exports = setupComponentArray;
