import test from 'ava';
import path from 'path';
import {
    Defaults,
    Types,
    DataObject
} from '../../src/models';

const options = {
    rootPath: path.join(__dirname, 'tests'),
    layout: {
        head: '<!DOCTYPE html><html><head>',
        start: '<body><div id="app">',
        end: '</div></body></html>'
    }
};
const types = new Types();
const defaultObject = new Defaults(options);
const dataObject = new DataObject(options, defaultObject, types.COMPONENT);
const dataObjectSub = new DataObject(options, defaultObject, types.SUBCOMPONENT);

//Examples
const exampleObject = {
    rootPath: options.rootPath,
    layout: {
        head: '<!DOCTYPE html><html><head>',
        start: '<body><div id="app">',
        end: '</div></body></html>'
    },
    options: {
        rootPath: options.rootPath,
    },
    cache: {
        max: 500,
        maxAge: 3600000
    }
};

test('Root Path', t => {
    t.is(defaultObject.rootPath, exampleObject.rootPath);
});

test('Default Layout', t => {
    t.deepEqual(defaultObject.layout, exampleObject.layout);
});
