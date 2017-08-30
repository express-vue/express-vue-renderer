import test from 'ava';
import path from 'path';
import {
    PathUtils
} from '../../src/utils';
import Models from '../../src/models';

const rootPath = path.join(__dirname, '../../example/');
const defaults = new Models.Defaults();
var LRU = require('lru-cache');
var cacheOptions = {
    max: 500,
    maxAge: 1000 * 60 * 60
};
var lruCache = LRU(cacheOptions);

test('correctPath Path', t => {
    const filePath = path.join(rootPath, '../example/components/uuid.vue');
    const correctPath = rootPath + 'components/uuid.vue';

    return PathUtils.getCorrectPathForFile(filePath, 'view', defaults, lruCache)
        .then(returnedPath => {
            t.is(returnedPath.path, correctPath);
        })

});


test('shows error for fake test Path ', t => {

    const filePath = path.join(rootPath, 'componentDoesntExist.vue');
    const errMessage = `Could not find test file at ${rootPath}componentDoesntExist.vue`

    return PathUtils.getCorrectPathForFile(filePath, 'test', defaults, lruCache)
        .catch(error => {
            console.log(error)
            t.is(error.message, errMessage);
        })
});
