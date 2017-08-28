// @flow
const path = require('path');
const deepmerge = require('deepmerge');
const Layout = require('./layout');

function concatMerge(destinationArray, sourceArray) {
    let finalArray = destinationArray.concat(sourceArray);
    //Dedupes dupes... obviously... but theres a problem here
    // return dedupe(finalArray);
    return finalArray;
}

class Defaults {
    rootPath: string;
    component: string;
    layout: Layout.Layout;
    options: Object;
    vue: Object;
    data: Object;
    constructor(options: Object = {}) {
        this.options = options;
        this.layout = new Layout.Layout(options.layout);

        if (options.rootPath) {
            this.rootPath = path.resolve(options.rootPath);
        }
        if (options.component) {
            this.component = options.component;
        }

        if (options.vue) {
            this.vue = options.vue;
        } else {
            this.vue = {};
        }
        if (options.data) {
            this.data = options.data;
        } else {
            this.data = {};
        }
    }
    static mergeObjects(globalObject: Object, newObject: Object): Object {
        const mergedObject = deepmerge(globalObject, newObject, { arrayMerge: concatMerge });
        return mergedObject;
    }
}

module.exports = Defaults;
