// @flow
'use strict';
const {Defaults} = require('./models');
const Utils = require('./utils');
const Renderer = require('./renderer');
const renderer = require('vue-server-renderer').createRenderer();

var NodeCache = require('node-cache');
//TODO add cache options via ENV
var myCache = new NodeCache({});

const regexes = {
    appRegex   : /{{{\s*app\s*}}}/igm,
    scriptRegex: /{{{\s*script\s*}}}/igm,
    headRegex  : /<\/head>/igm
};

let GlobalOptions = {};

function expressVueRenderer(componentPath: string, data: Object): Promise<Object> {
    return new Promise((resolve, reject) => {
        try {
            GlobalOptions.options.data = data;
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
                            Renderer.renderError(error);
                        });
                })
                .catch(error => {
                    Renderer.renderError(error);
                });
        } catch (e) {
            Renderer.renderError(e);
        }
    });
}

function init(options: Object) {
    GlobalOptions = new Defaults(options);
    return (req: Object, res: Object, next: Function) => {
        res.renderVue = (componentPath: string, data: Object) => {
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
                    expressVueRenderer(componentPath, data)
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

module.exports.expressVueRenderer = expressVueRenderer;
module.exports.init = init;
