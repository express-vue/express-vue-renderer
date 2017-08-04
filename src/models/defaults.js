// @flow
const LRU = require('lru-cache');
const path = require('path');
const deepmerge = require('deepmerge');
const Layout = require('./layout');
const options = {
    max: 500,
    maxAge: 1000 * 60 * 60
};
const lruCache = LRU(options);

class Defaults {
    rootPath: string;
    component: string;
    layout: Layout.Layout;
    options: Object;
    cache: LRU;
    vue: Object;
    data: Object;
    constructor(options: Object = {}) {
        this.cache = lruCache;
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
    mergeVueObject(newVueObject: Object): void {
        this.vue = deepmerge(this.vue, newVueObject);
    }
    mergeDataObject(newDataObject: Object): void {
        this.data = deepmerge(this.data, newDataObject);
    }
}

module.exports = Defaults;
