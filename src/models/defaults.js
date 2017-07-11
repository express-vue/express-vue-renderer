// @flow
const LRU = require('lru-cache');
const path = require('path');
const options = {
    max: 500,
    maxAge: 1000 * 60 * 60
};
const lruCache = LRU(options);

class Defaults {
    rootPath: string;
    componentsPath: string;
    viewsPath: string;
    layout: {start: string, middle: string, end: string};
    options: Object;
    cache: LRU;
    constructor(options: Object = {}) {
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
            this.layout = options.layout;
        } else {
            this.layout = {
                start: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><script src="https://unpkg.com/vue/dist/vue.js"></script>',
                middle: '<body><div id="app">',
                end: '</div></body></html>'
            };
        }
        this.options       = options;
        this.cache         = lruCache;
    }
}

module.exports = Defaults;
