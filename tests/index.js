// @flow
const test = require('ava');
const ExpressVueRenderer = require('../src');
const Models = require('../src/models');
const path = require('path');

const component = path.join(__dirname, '/vueFiles/component.vue');

const options = {
    rootPath: path.join(__dirname, '/'),
    componentsPath: 'vueFiles/components',
    viewsPath: 'vueFiles'
};

const data = {
    title: 'Express Vue',
    message: 'Hello world',
    uuid: 'farts'
};

const vueOptions = {
    components: ['uuid'],
    head: {
        title: 'Page Title'
    }
}

const exampleHead = `<!DOCTYPE html><html><head><title>Page Title</title>
<style>.test{color:#00f}</style></head><body><div id="app">`

test('renders App object', t => {
    const renderer = new ExpressVueRenderer(options);
    return renderer.renderToStream('main', data, vueOptions)
        .then(app => {
            t.is(app.head, exampleHead);
        })
        .catch(error => {
            t.fail(error.stack);
        });

});
