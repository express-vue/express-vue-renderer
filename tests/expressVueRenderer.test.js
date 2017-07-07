// @flow
const expressVueRenderer = require('../lib');
const Utils = require('../lib/utils');
const renderer = require('vue-server-renderer').createRenderer();

const options = {
    settings: {
        vue: {
            componentsDir: '/tests',
            defaultLayout: 'main'
        },
        views: '/tests'
    }
};
const data = {
    message: 'Hello world'
}
const component = __dirname + '/component.vue';

const htmlTemplate = {
    start: '<html><head>',
    middle: '<body>',
    end: '</body></html>'
};

expressVueRenderer.expressVueRenderer(component, data, options).then(app => {
    const vueStream = renderer.renderToStream(app.app);
    let htmlStream = '';
    const htmlStringStart = app.template.start + app.head + app.template.middle;
    const htmlStringEnd = app.script + app.template.end;
    htmlStream = new Utils.StreamUtils(htmlStringStart, htmlStringEnd);
    htmlStream = vueStream.pipe(htmlStream);
    htmlStream.on('data', chunk => {
        console.log(chunk.toString());
    });
    htmlStream.on('end', () => {
    });
}).catch(error => {
    console.error(error);
});
