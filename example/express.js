// @flow
const path = require('path');
const express = require('express');
const uuidv4 = require('uuid/v4');

const expressVueRenderer = require('../lib');

const options = {
    rootPath: path.join(__dirname, '/../tests'),
    viewsPath: 'vueFiles',
    componentsPath: 'vueFiles/components',
    layout: {
        start: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><script src="https://unpkg.com/vue/dist/vue.js"></script>',
        middle: '<body><div id="app">',
        end: '</div></body></html>'
    }
};

const renderer = expressVueRenderer.init(options);
const app = express();
app.use(express.static('./dist'));

app.use(renderer);

app.get('/', (req, res) => {
    const data = {
        title: 'Express Vue',
        message: 'Hello world',
        uuid: uuidv4()
    };
    const vueOptions = {
        components: ['uuid']
    }
    res.renderVue('main.vue', data, vueOptions)
});

app.listen(3000);

console.log('express example start in 127.0.0.1:3000');
module.exports = app;
