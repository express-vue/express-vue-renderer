// @flow
'use strict';
const Models = require('./models');
const Utils = require('./utils');
const Renderer = require('./renderer');
const vueServerRenderer = require('vue-server-renderer').createRenderer();

class ExpressVueRenderer {
    GlobalOptions: Models.Defaults;
    constructor(options: Object) {
        this.GlobalOptions = new Models.Defaults(options);
    }
    createAppObject(componentPath: string, data: Object, vueOptions:? Object): Promise < Object > {
        return new Promise((resolve, reject) => {
            this.GlobalOptions.mergeDataObject(data);
            if (vueOptions) {
                this.GlobalOptions.mergeVueObject(vueOptions);
            }
            Utils.setupComponentArray(componentPath, this.GlobalOptions)
                .then(promiseArray => {
                    Promise.all(promiseArray)
                        .then((components) => {
                            const rendered = Renderer.renderHtmlUtil(components, this.GlobalOptions);
                            if (!rendered) {
                                reject(new Error('Renderer Error'));
                            } else {
                                const VueClass = rendered.app;
                                const template = this.GlobalOptions.layout;
                                const script = rendered.scriptString;
                                const head = Utils.headUtil(this.GlobalOptions.vue, rendered.layout.style);

                                const app = new Models.AppClass(VueClass, template, script, head);
                                resolve(app);
                            }
                        }).catch((error) => {
                            reject(error);
                        });
                }).catch(error => {
                    reject(error);
                });
        });
    }
    renderToStream(componentPath: string, data: Object, vueOptions: Object): Promise < Object > {
        return new Promise((resolve, reject) => {
            this.createAppObject(componentPath, data, vueOptions)
                .then(app => {
                    const vueStream = vueServerRenderer.renderToStream(app.VueClass);
                    let htmlStream;
                    const htmlStringStart = app.template.start + app.head + app.template.middle;
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
