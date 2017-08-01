// @flow
const LRU = require('lru-cache');
const path = require('path');
const deepmerge = require('deepmerge');
const options = {
    max: 500,
    maxAge: 1000 * 60 * 60
};
const lruCache = LRU(options);

class Defaults {
    rootPath: string;
    componentsPath: string;
    viewsPath: string;
    layout: {
        head: string,
        start: string,
        end: string
    };
    options: Object;
    cache: LRU;
    vue: Object;
    data: Object;
    constructor(options: Object = {}) {
        this.cache = lruCache;
        this.options = options;

        if (options.rootPath) {
            this.rootPath = path.resolve(options.rootPath);
        }
        if (options.componentsPath) {
            this.componentsPath = path.resolve(this.rootPath, options.componentsPath);
        }
        if (options.viewsPath) {
            this.viewsPath = path.resolve(this.rootPath, options.viewsPath);
        }
        if (options.layout) {
            this.layout = {};
            this.layout.head = options.layout.head ? options.layout.head : '<!DOCTYPE html><html><head>';
            this.layout.start = options.layout.start ? options.layout.start : '<body><div id="app">';
            this.layout.end = options.layout.end ? options.layout.end : '</div></body>';
        } else {
            this.layout = {
                head: '<!DOCTYPE html><html><head>',
                start: '<body><div id="app">',
                end: '</div></body>'
            };
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
