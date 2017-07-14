// @flow
'use strict';
const {
    Defaults
} = require('./models');
const Utils = require('./utils');
const Renderer = require('./renderer');
const vueServerRenderer = require('vue-server-renderer').createRenderer();

function renderer(componentPath: string, data: Object, vueOptions: ? Object, GlobalOptions : Defaults): Promise < Object > {
    return new Promise((resolve, reject) => {

        GlobalOptions.mergeDataObject(data);
        if (vueOptions) {
            GlobalOptions.mergeVueObject(vueOptions);
        }
        Utils.setupComponentArray(componentPath, GlobalOptions)
            .then(promiseArray => {
                Promise.all(promiseArray)
                    .then(function(components) {
                        const rendered = Renderer.renderHtmlUtil(components, GlobalOptions);
                        if (!rendered) {
                            reject(new Error('Renderer Error'));
                        } else {
                            const app = {
                                head: Utils.headUtil(GlobalOptions.vue, rendered.layout.style),
                                app: rendered.app,
                                script: rendered.scriptString,
                                template: GlobalOptions.layout
                            };
                            resolve(app);
                        }
                    })
                    .catch(function(error) {
                        reject(new Error(error));
                    });
            })
            .catch(error => {
                reject(new Error(error));
            });
    });
}

function renderToStream(componentPath, data, vueOptions, GlobalOptions): Promise < Object > {
    return new Promise((resolve, reject) => {
        renderer(componentPath, data, vueOptions, GlobalOptions)
            .then(app => {
                const vueStream = vueServerRenderer.renderToStream(app.app);
                let htmlStream;

                if (!GlobalOptions.pure) {
                    const htmlStringStart = app.template.start + app.head + app.template.middle;
                    const htmlStringEnd = app.script + app.template.end;
                    htmlStream = new Utils.StreamUtils(htmlStringStart, htmlStringEnd);
                    htmlStream = vueStream.pipe(htmlStream);
                    GlobalOptions.pure = true;
                } else {
                    htmlStream = vueStream;
                }
                resolve(htmlStream);
            })
            .catch(error => {
                reject(error);
            });
    });
}

module.exports.renderer = renderer;
module.exports.renderToStream = renderToStream;
