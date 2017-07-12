import test from 'ava';
import fs from 'fs';
import path from 'path';
import {Defaults, Types} from '../../src/models';
import * as Parser from '../../src/parser';
import {renderHtmlUtil} from '../../src/utils';

let types    = new Types();
const component = __dirname + '/../vueFiles/components/uuid.vue';
const options = {
    rootPath: path.join(__dirname, 'tests'),
    componentsPath: 'vueFiles/components',
    viewsPath: 'vueFiles'
};

const defaultObject = new Defaults(options);
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
        return Parser.htmlParser(content, htmlRegex, true)
            .then(html => {
                t.is(html, '<div class=""><h2>Uuid: {{uuid ? uuid : \'no uuid\'}}</h2></div>');
                t.end();
            })
            .catch(error => {
                t.fail(error);
                t.end();
            });
    })
});

test.cb('it should parse style', t => {
    fs.readFile(component, 'utf-8', function(err, content) {
        if (err) {
            content = defaultObject.backupLayout;
        }

        return Parser.styleParser(content)
            .then(style => {
                t.is(style, '.test{color:#00f}');
                t.end();
            })
            .catch(error => {
                t.fail(error);
                t.end();
            });
    })
});

test.cb('it should parse scripts', t => {
    fs.readFile(component, 'utf-8', function(err, content) {
        if (err) {
            content = defaultObject.backupLayout;
        }
        return Parser.scriptParser(content, defaultObject, types.SUBCOMPONENT)
            .then(script => {
                t.is(typeof script, 'object');
                t.end();
            })
            .catch(error => {
                t.fail(error);
                t.end();
            });

    })
})
