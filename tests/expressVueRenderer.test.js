const expressVueRenderer = require('../lib');

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
    expressVueRenderer.renderToString(app).then(string => {
        console.error(string);
    }).catch(error => {
        console.error(error);
    });
}).catch(error => {
    console.error(error);
});
