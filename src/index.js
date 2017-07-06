// @flow
'use strict';
const {Defaults} = require('./models');
const Utils = require('./utils');
const Renderer = require('./renderer');
const renderer = require('vue-server-renderer').createRenderer();


const regexes = {
    appRegex   : /{{{\s*app\s*}}}/igm,
    scriptRegex: /{{{\s*script\s*}}}/igm,
    headRegex  : /<\/head>/igm
};

function renderToString(rendered: Object): Promise<string> {
    return new Promise((resolve, reject) => {
        renderer.renderToString(rendered.app, function (error, renderedHtml) {
            if (error) {
                reject(error);
            } else {
                let html = '';
                let head = '';
                html = rendered.layout.template.replace(regexes.appRegex, `<div id="app">${renderedHtml}</div>`);
                html = html.replace(regexes.scriptRegex, rendered.scriptString);
                head = Utils.headUtil(defaults.options.vue, rendered.layout.style);
                html = html.replace(regexes.headRegex, head);
                resolve(html);
            }
        });
    });
}

function expressVueRenderer(componentPath: string, options: Object): Promise<Object> {
    const defaults = new Defaults(options);

    return new Promise((resolve, reject) => {
        Utils.setupComponentArray(componentPath, defaults)
            .then(promiseArray => {
                Promise.all(promiseArray)
                    .then(function(components) {
                        const rendered = Renderer.renderHtmlUtil(components, defaults);
                        if (!rendered) {
                            reject(Renderer.renderError('Renderer Error'));
                        } else {
                            let html = '';
                            let head = '';
                            html = rendered.layout.template.replace(regexes.appRegex, `<div id="app">${renderedHtml}</div>`);
                            html = html.replace(regexes.scriptRegex, rendered.scriptString);
                            head = Utils.headUtil(defaults.options.vue, rendered.layout.style);
                            html = html.replace(regexes.headRegex, head);
                            const app = {
                                head: Utils.headUtil(defaults.options.vue, rendered.layout.style),
                                app: rendered.app,
                                script: rendered.scriptString,

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
    });
}

module.exports.expressVueRenderer = expressVueRenderer;
module.exports.regexes = regexes;
