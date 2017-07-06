const expressVueRenderer = require('../lib');
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
const component = __dirname + '/component.vue';

expressVueRenderer.expressVueRenderer(component, options).then(app => {
    renderer.renderToString(app.app, function (error, renderedHtml) {
        if (error) {
            throw error;
        } else {
            console.error(renderedHtml);
        }
    });
}).catch(error => {
    console.error(error);
});
