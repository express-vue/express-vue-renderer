// @flow
'use strict';
const Models = require('./models');
const Utils = require('./utils');
const Renderer = require('./renderer');
const vueServerRenderer = require('vue-server-renderer').createRenderer();

/**
 * ExpressVueRenderer Class is the main init Class
 * init with `new ExpressVueRenderer(options)`
 * returns the ExpressVueRenderer class
 * @class
 */
class ExpressVueRenderer {
    GlobalOptions: Models.Defaults;
    /**
     * ExpressVueRenderer constructor
     * @constructor
     * @param {Object} options - The options passed to init the class
     */
    constructor(options: Object) {
        this.GlobalOptions = new Models.Defaults(options);
    }
    /**
     * createAppObject is an internal function used by renderToStream
     * @param  {string} componentPath - full path to .vue file
     * @param  {Object} data          - data to be inserted when generating vue class
     * @param  {Object} vueOptions    - vue options to be used when generating head
     * @return {Promise}              - Promise consists of an AppClass Object
     */
    createAppObject(componentPath: string, data: Object, vueOptions: ? Object): Promise < Models.AppClass > {
        return new Promise((resolve, reject) => {
            this.GlobalOptions.mergeDataObject(data);
            if (vueOptions) {
                this.GlobalOptions.mergeVueObject(vueOptions);
            }
            Utils.setupComponent(componentPath, this.GlobalOptions)
                .then((component) => {

                    const rendered = Renderer.renderHtmlUtil(component);
                    if (!rendered) {
                        reject(new Error('Renderer Error'));
                    } else {
                        const VueClass = rendered.app;
                        const template = this.GlobalOptions.layout;
                        const script = rendered.scriptString;
                        const head = new Utils.HeadUtils(this.GlobalOptions.vue, rendered.layout.style);

                        const app = new Models.AppClass(VueClass, template, script, head.toString());
                        resolve(app);
                    }
                }).catch((error) => {
                    reject(error);
                });

        });
    }
    /**
     * renderToStream is the main function used by res.renderVue
     * @param {string} componentPath - full path to .vue component
     * @param  {Object} data          - data to be inserted when generating vue class
     * @param  {Object} vueOptions    - vue options to be used when generating head
     * @return {Promise}              - Promise returns a Stream
     */
    renderToStream(componentPath: string, data: Object, vueOptions: Object): Promise < Object > {
        return new Promise((resolve, reject) => {
            this.createAppObject(componentPath, data, vueOptions)
                .then(app => {
                    const vueStream = vueServerRenderer.renderToStream(app.VueClass);
                    let htmlStream;
                    const htmlStringStart = app.template.head + app.head + app.template.start;
                    const htmlStringEnd = app.script + app.template.end;

                    htmlStream = new Utils.StreamUtils(htmlStringStart, htmlStringEnd);
                    htmlStream = vueStream.pipe(htmlStream);

                    resolve(htmlStream);
                }).catch(error => {
                    reject(error);
                });
        });
    }
}

module.exports = ExpressVueRenderer;
