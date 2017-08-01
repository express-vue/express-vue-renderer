// @flow
const path = require('path');
const express = require('express');
const uuidv4 = require('uuid/v4');

const expressVueRenderer = require('../lib');
const expressVue = require('./expressVue');

var exampleMixin = {
    methods: {
        hello: function () {
            console.log('Hello');
        }
    }
};

const options = {
    rootPath: path.join(__dirname, '/../tests'),
    viewsPath: 'vueFiles',
    componentsPath: 'vueFiles/components',
    layout: {
        start: '<body><div id="app">',
        end: '</div></body>'
    },
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
                    script: 'https://unpkg.com/vue@2.3.4/dist/vue.js'
                }, {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
                }
            ]
        },
        // mixins: [exampleMixin]
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
        uuid: uuidv4()
    };
    const vueOptions = {
        components: ['uuid'],
        head: {
            title: 'Page Title',

        }
    }
    res.renderVue('main.vue', data, vueOptions)
});

app.listen(3000);

console.log('express example start in 127.0.0.1:3000');
module.exports = app;
