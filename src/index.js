// @flow
'use strict';
const {
    Defaults
} = require('./models');
const Utils = require('./utils');
const Renderer = require('./renderer');
const vueServerRenderer = require('vue-server-renderer').createRenderer();

function renderer(componentPath: string, data: Object, GlobalOptions: Defaults, vueOptions: ? Object): Promise < Object > {
    return new Promise((resolve, reject) => {

        GlobalOptions.mergeDataObject(data);
        if (vueOptions) {
            GlobalOptions.mergeVueObject(vueOptions);
        }
        Utils.setupComponentArray(componentPath, GlobalOptions)
            .then(promiseArray => {
                Promise.all(promiseArray)
                    .then(function (components) {
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
                    .catch(function (error) {
                        reject(new Error(error));
                    });
            })
            .catch(error => {
                reject(new Error(error));
            });
    });
}

function init(options: Object) {
    //Make new object
    const GlobalOptions = new Defaults(options);
    //Middleware init
    return (req: Object, res: Object, next: Function) => {
        //Res RenderVUE function
        res.renderVue = (componentPath: string, data: Object, vueOptions: ? Object) => {
            res.set('Content-Type', 'text/html');
            renderer(componentPath, data, GlobalOptions, vueOptions)
                .then(app => {
                    const vueStream = vueServerRenderer.renderToStream(app.app);
                    let htmlStream;
                    const htmlStringStart = app.template.start + app.head + app.template.middle;
                    const htmlStringEnd = app.script + app.template.end;
                    htmlStream = new Utils.StreamUtils(htmlStringStart, htmlStringEnd);
                    htmlStream = vueStream.pipe(htmlStream);
                    htmlStream.on('data', chunk => {
                        res.write(chunk);
                    });
                    htmlStream.on('end', () => {
                        res.end();
                    });
                })
                .catch(error => {
                    // console.log(error);
                    return next(error);
                });
        };
        return next();
    };
}

module.exports.renderer = renderer;
module.exports.init = init;
