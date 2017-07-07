import test from 'ava';
import fs from 'fs';
import {Defaults, Types} from '../../src/models';
import * as Parser from '../../src/parser';
import {renderHtmlUtil} from '../../src/utils';

let types    = new Types();
const component = __dirname + '/../vueFiles/component.vue';
const defaults = {
    settings: {
        vue: {
            componentsDir: '',
            defaultLayout: 'qux'
        },
        views: '/foo/bar'
    }
};

const defaultObject = new Defaults(defaults);
defaultObject.options = {
    vue: {}
}

test('it should parse components', t => {
    return Parser.componentParser(component, defaultObject, types.COMPONENT)
    .then(function(layout) {
        const exampleLayout = {
            type: 'COMPONENT',
            style: '.test{color:#00f}',
            name: 'component',
            script: {
                data() {
                    return {
                    }
                },
                template: '<div class=""><h1>{{message}}</h1></div>'
            }
        }
        t.is(layout.style, exampleLayout.style);
    })
    .catch(function(error) {
        t.fail(error)
    })
});

test.cb('it should parse html', t => {
    fs.readFile(component, 'utf-8', function(err, content) {
        if (err) {
            content = defaultObject.backupLayout;
        }
        const htmlRegex = /(<template.*?>)([\s\S]*)(<\/template>)/gm;
        const html = Parser.htmlParser(content, htmlRegex, true);
        t.is(html, '<div class=""><h1>{{message}}</h1></div>');
        t.end();
    })
});

test.cb('it should parse style', t => {
    fs.readFile(component, 'utf-8', function(err, content) {
        if (err) {
            content = defaultObject.backupLayout;
        }

        const style = Parser.styleParser(content);
        t.is(style, '.test{color:#00f}');
        t.end();
    })
});

test.cb('it should parse scripts', t => {
    fs.readFile(component, 'utf-8', function(err, content) {
        if (err) {
            content = defaultObject.backupLayout;
        }
        const script = Parser.scriptParser(content, defaultObject, types.SUBCOMPONENT)
        t.is(typeof script, 'object');
        t.end();
    })
})
