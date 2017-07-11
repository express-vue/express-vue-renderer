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
    rootPath: path.join(__dirname, '/'),
    componentsPath: 'vueFiles/components',
    viewsPath: 'vueFiles'
};

test('renders App object', t => {
    const GlobalOptions = new Models.Defaults(options);
    return ExpressVueRenderer.renderer('main', data, GlobalOptions)
        .then(app => {
            t.is(app.head, '</head>');
        })
        .catch(error => {
            // console.error(JSON.stringify(error, null, 2));
            t.fail(error);
        });

});
