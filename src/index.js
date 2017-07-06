// @flow
'use strict';
const {Defaults} = require('./models');
const Utils = require('./utils');
const Renderer = require('./renderer');

const regexes = {
    appRegex   : /{{{\s*app\s*}}}/igm,
    scriptRegex: /{{{\s*script\s*}}}/igm,
    headRegex  : /<\/head>/igm
};

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
                            resolve(rendered);
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
