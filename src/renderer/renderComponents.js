// @flow
const Renderer = require('./render');
const {Defaults} = require('../models');
const Utils = require('../utils');




function renderComponents(components: Object[], defaults: Defaults): Promise<Object> {
    return new Promise((resolve, reject) => {

        // renderer.renderToString(rendered.app, function (error, renderedHtml) {
        //     if (error) {
        //         reject(error);
        //     } else {
        //         let html = '';
        //         let head = '';
        //         html = rendered.layout.template.replace(appRegex, `<div id="app">${renderedHtml}</div>`);
        //         html = html.replace(scriptRegex, rendered.scriptString);
        //         head = Utils.headUtil(defaults.options.vue, rendered.layout.style);
        //         html = html.replace(headRegex, head);
        //         resolve(html);
        //     }
        // });
    });
}

module.exports = renderComponents;
