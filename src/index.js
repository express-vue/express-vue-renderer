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
                            reject(Renderer.renderError('Renderer Error'));
                        } else {
                            const app = {
                                head: Utils.headUtil(GlobalOptions.options.vue, rendered.layout.style),
                                app: rendered.app,
                                script: rendered.scriptString,
                                template: GlobalOptions.backupLayout
                            };
                            resolve(app);
                        }
                    })
                    .catch(function(error) {
                        reject(Renderer.renderError(error));
                    });
            })
            .catch(error => {
                reject(Renderer.renderError(error));
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

            //Caching
            let cacheObject = Object.assign({}, data);

            const cacheKey = componentPath + JSON.stringify(cacheObject);
            myCache.get(cacheKey, (error, cachedString) => {
                if (error) {
                    Renderer.renderError(error);
                } else if (cachedString) {
                    res.send(cachedString);
                } else {
                    //
                    expressVueRenderer(componentPath, data, vueOptions)
                        .then(app => {
                            const vueStream = renderer.renderToStream(app.app);
                            let htmlStream;
                            let htmlCacheString = '';
                            const htmlStringStart = app.template.start + app.head + app.template.middle;
                            const htmlStringEnd = app.script + app.template.end;
                            htmlStream = new Utils.StreamUtils(htmlStringStart, htmlStringEnd);
                            htmlStream = vueStream.pipe(htmlStream);
                            htmlStream.on('data', chunk => {
                                res.write(chunk);
                                htmlCacheString += chunk.toString();
                            });
                            htmlStream.on('end', () => {
                                res.end();
                                myCache.set(cacheKey, htmlCacheString, err => {
                                    if (err) {
                                        Renderer.renderError(error);
                                    }
                                });
                            });
                        })
                        .catch(error => {
                            Renderer.renderError(error);
                        });
                }
            });


        };
        return next();
    };
}

module.exports.renderer = expressVueRenderer;
module.exports.GlobalOptions = GlobalOptions;
module.exports.init = init;
