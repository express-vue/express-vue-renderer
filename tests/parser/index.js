import test from 'ava';
import fs from 'fs';
import path from 'path';
import {
    Defaults,
    Types
} from '../../src/models';
import * as Parser from '../../src/parser';
import {
    renderHtmlUtil
} from '../../src/utils';

const compiler = require('vue-template-compiler');

var LRU = require('lru-cache');
var cacheOptions = {
    max: 500,
    maxAge: 1000 * 60 * 60
};
var lruCache = LRU(cacheOptions);

let types = new Types();
const component = __dirname + '/../../example/vueFiles/components/uuid.vue';
const options = {
    rootPath: path.join(__dirname, 'tests'),
    component: 'uuid.vue'
};

const defaultObject = new Defaults(options);
defaultObject.options = {
    vue: {}
}

const parsedContentObject = {
    template: {
        type: 'template',
        content: '\n<div class="">\n    <h2>Uuid: {{uuid ? uuid : \'no uuid\'}}</h2>\n</div>\n',
        start: 22,
        attrs: {
            lang: 'html'
        },
        lang: 'html',
        end: 98
    },
    script: {
        type: 'script',
        content: '\nexport default {\n    props: [\'uuid\'],\n    data: function() {\n        return {}\n    }\n}\n',
        start: 119,
        attrs: {},
        end: 207
    },
    styles: [{
        type: 'style',
        content: '\n.test {\n    color: blue;\n}\n',
        start: 236,
        attrs: [Object],
        lang: 'css',
        end: 276
    }],
    customBlocks: []
};

test('it should parse components', t => {
    return Parser.componentParser(component, defaultObject, types.COMPONENT, lruCache)
        .then(function (layout) {
            const exampleLayout = {
                type: 'COMPONENT',
                style: '.test{color:#00f}',
                name: 'component',
                script: {
                    data() {
                        return {}
                    },
                    template: '<div class=""><h1>{{message}}</h1></div>'
                }
            }
            t.is(layout.style, exampleLayout.style);
        })
        .catch(function (error) {
            t.fail(error)
        })
});

test('it should parse html', t => {

    return Parser.htmlParser(parsedContentObject.template, true)
        .then(html => {
            t.is(html, '<div class=""><h2>Uuid: {{uuid ? uuid : \'no uuid\'}}</h2></div>');
        })
        .catch(error => {
            t.fail(error);
        });
});

test('it should parse style', t => {
    return Parser.styleParser(parsedContentObject.styles)
        .then(style => {
            t.is(style, '.test{color:#00f}');
        })
        .catch(error => {
            t.fail(error);
        });
});

test('it should parse scripts', t => {
    return Parser.scriptParser(parsedContentObject.script, defaultObject, types.SUBCOMPONENT, lruCache)
        .then(script => {
            t.is(typeof script, 'object');
        })
        .catch(error => {
            t.fail(error);
        });
})
