// @flow
'use strict';
const {Defaults} = require('./models');
const Utils = require('./utils');
const Renderer = require('./renderer');
const renderer = require('vue-server-renderer').createRenderer();

var NodeCache = require('node-cache');
//TODO add cache options via ENV
var myCache = new NodeCache({});

let GlobalOptions = {};

function expressVueRenderer(componentPath: string, data: Object, vueOptions: ?Object, options: ?Object): Promise<Object> {
    return new Promise((resolve, reject) => {
        //Caching
        let cacheObject = Object.assign({}, data);

        const cacheKey = componentPath + JSON.stringify(cacheObject);
        myCache.get(cacheKey, (error, cachedAppObject) => {
            if (error) {
                reject(new Error(error));
            } else if (cachedAppObject) {
                resolve(cachedAppObject);
            } else {
                if (options) {
                    GlobalOptions = new Defaults(options);
                }
                GlobalOptions.options.data = data;
                if (vueOptions) {
                    GlobalOptions.options.vue = vueOptions;
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
                                        head: Utils.headUtil(GlobalOptions.options.vue, rendered.layout.style),
                                        app: rendered.app,
                                        script: rendered.scriptString,
                                        template: GlobalOptions.backupLayout
                                    };
                                    myCache.set(cacheKey, app, err => {
                                        if (err) {
                                            reject(new Error(error));
                                        }
                                    });
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
            }
        });
    });
}

function init(options: Object) {
    GlobalOptions = new Defaults(options);

    //Middleware init
    return (req: Object, res: Object, next: Function) => {

        //Res RenderVUE function
        res.renderVue = (componentPath: string, data: Object, vueOptions: ?Object) => {
            res.set('Content-Type', 'text/html');
            expressVueRenderer(componentPath, data, vueOptions)
                .then(app => {
                    const vueStream = renderer.renderToStream(app.app);
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
                    new Error(error);
                });
        };
        return next();
    };
}

module.exports.renderer = expressVueRenderer;
module.exports.GlobalOptions = GlobalOptions;
module.exports.init = init;
