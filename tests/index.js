// @flow
const test = require('ava');
const ExpressVueRenderer = require('../src');
const Models = require('../src/models');
const path = require('path');

const component = path.join(__dirname, '/vueFiles/component.vue');

const data = {
    message: 'Hello world'
};

const options = {
    settings: {
        vue: {
            componentsDir: path.join(__dirname, '/tests/vueFiles')
        },
        views: path.join(__dirname, '/tests/vueFiles')
    }
};

test('renders App object', t => {
    return ExpressVueRenderer.renderer(component, data, {}, options)
        .then(app => {
            t.is(app.head, '<style>.test{color:#00f}</style></head>');
        })
        .catch(error => {
            t.fail();
        });

});
