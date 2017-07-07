import test   from 'ava';
import {Defaults, Types, DataObject} from '../../src/models';

const defaults = {
    layout: 'fooBar',
    settings: {
        vue: {
            componentsDir: '/baz',
            defaultLayout: 'qux'
        },
        views: '/foo/bar'
    }
};
const types         = new Types();
const defaultObject = new Defaults(defaults);
const dataObject    = new DataObject(defaults, defaultObject, types.COMPONENT);
const dataObjectSub = new DataObject(defaults, defaultObject, types.SUBCOMPONENT);

//Examples
const exampleObject = {
  rootPath: '/foo/bar/',
  layoutsDir: '',
  componentsDir: '/baz/',
  customLayout: '/foo/bar/fooBar',
  defaultLayout: '/foo/bar/qux',
  options: {
      settings: {
          vue: {
              componentsDir: '/baz',
              defaultLayout: 'qux'
          },
          views: '/foo/bar'
      }
  },
  backupLayout: {
      start: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><script src="https://unpkg.com/vue/dist/vue.js"></script>',
      middle: '<body><div id="app">',
      end: '</div></body></html>'
  },
  layoutPath: '/foo/bar/qux.vue'
};

test('Components Directory', t => {
    t.is(defaultObject.componentsDir, exampleObject.componentsDir);
});

test('Root Path', t => {
    t.is(defaultObject.rootPath, exampleObject.rootPath);
});

test('Backup Layout', t => {
    t.deepEqual(defaultObject.backupLayout, exampleObject.backupLayout);
});

test('Default Layout', t => {
    t.is(defaultObject.defaultLayout, exampleObject.defaultLayout);
});

test('layoutsDir', t => {
    t.is(defaultObject.layoutsDir, exampleObject.layoutsDir);
});

test('customLayout', t => {
    t.is(defaultObject.customLayout, exampleObject.customLayout);
});
