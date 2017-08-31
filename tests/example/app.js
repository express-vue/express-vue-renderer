// @flow
const path = require('path');
const express = require('express');
const uuidv4 = require('uuid/v4');

const expressVueRenderer = require('../../lib');
const expressVue = require('./expressVue');

var exampleMixin = {
    methods: {
        hello: function () {
            console.log('Hello');
        }
    }
};

const options = {
    rootPath: path.join(__dirname, 'vueFiles'),
    vue: {
        head: {
            meta: [{
                    property: 'og:title',
                    content: 'Page Title'
                },
                {
                    name: 'twitter:title',
                    content: 'Page Title'
                },
                {
                    script: 'https://unpkg.com/vue@2.4.2/dist/vue.js'
                }, {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                }
            ]
        }
    },
    data: {
        thing: true
    }
};


renderer = expressVue.init(options);

const app = express();
app.use(express.static('./dist'));

app.use(renderer);

app.get('/', (req, res) => {
    const data = {
        title: 'Express Vue',
        message: 'Hello world',
        uuid: uuidv4(),
        uuid2: uuidv4()
    };
    const vueOptions = {
        head: {
            title: 'Page Title',
            meta: [
                {
                    property: 'og:title2',
                    content: 'Page Title2'
                }
            ]
        }
    }
    res.renderVue('main.vue', data, vueOptions)
});

app.listen(3000);

console.log('express example start in 127.0.0.1:3000');
module.exports = app;
