const expressVueRenderer = require('../lib');
const Utils = require('../lib/utils')
const renderer = require('vue-server-renderer').createRenderer();
const regexes = expressVueRenderer.regexes;

expressVueRenderer.expressVueRenderer().then(rendered => {
    renderer.renderToString(rendered.app, function (error, renderedHtml) {
        if (error) {
            console.error(error);
        } else {
            let html = '';
            let head = '';
            html = rendered.layout.template.replace(regexes.appRegex, `<div id="app">${renderedHtml}</div>`);
            html = html.replace(regexes.scriptRegex, rendered.scriptString);
            head = Utils.headUtil(defaults.options.vue, rendered.layout.style);
            html = html.replace(regexes.headRegex, head);
            console.log(html);
        }
    });
}).catch(error => {
    console.error(error);
})
