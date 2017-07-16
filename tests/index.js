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

const exampleHead = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><script src="https://unpkg.com/vue/dist/vue.js"></script><title>Page Title</title>
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
