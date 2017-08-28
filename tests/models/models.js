import test from 'ava';
import path from 'path';
import {
    Defaults,
    Types,
    DataObject,
    Layout
} from '../../src/models';

const customLayout = {
    template: {
        start: '<div><div id="app">',
        end: '</div></div>'
    },
    body: {
        start: '<body class="foo">',
        end: '\n</body>'
    },
    html: {
        start: '<!DOCTYPE html><html lang="en">',
        end: '\n</html>'
    }
}

const options = {
    rootPath: path.join(__dirname, 'tests'),
    layout: customLayout,
    data: {
        foo: true
    },
    vue: {
        head: {
            title: 'bar',
            meta: [
                {foo: true}
            ]
        }

    }
};

const layout = new Layout.Layout(customLayout);
const types = new Types();
const defaultObject = new Defaults(options);
const dataObject = new DataObject(options, defaultObject, types.COMPONENT);
const dataObjectSub = new DataObject(options, defaultObject, types.SUBCOMPONENT);

//Examples
const exampleObject = {
    rootPath: options.rootPath,
    layout: customLayout,
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
    t.is(defaultObject.layout.template.start, exampleObject.layout.template.start);
    t.is(defaultObject.layout.template.end, exampleObject.layout.template.end);
    t.is(defaultObject.layout.html.start, exampleObject.layout.html.start);
    t.is(defaultObject.layout.html.end, exampleObject.layout.html.end);
    t.is(defaultObject.layout.body.start, exampleObject.layout.body.start);
    t.is(defaultObject.layout.body.end, exampleObject.layout.body.end);
});

test('Defaults data', t => {
    t.is(defaultObject.data.foo, true);
})

test('Defaults vue', t => {
    t.is(defaultObject.vue.head.title, 'bar');
})

test('Merges VueObject', t => {
    const testVueObject = {
        head: {
            meta: [
                {bar: false}
            ]
        }
    }
    const mergedObject = Defaults.mergeObjects(defaultObject.options.vue, testVueObject);
    t.deepEqual(mergedObject.head.meta, [{foo: true}, {bar: false}]);
})
