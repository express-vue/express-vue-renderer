// @flow
const path = require('path');
const express = require('express');

const expressVueRenderer = require('./lib');

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
};
const component = __dirname + '/tests/component.vue';

const renderer = expressVueRenderer.init(options);
const app = express();
app.use(express.static('./dist'));

app.use(renderer);

app.use((req, res) => res.renderVue(component, data));

app.listen(8081);

console.log('express example start in 127.0.0.1:8081');
module.exports = app;
