import test from 'ava';
import path from 'path';
import {
    PathUtils
} from '../../src/utils';
import Models from '../../src/models';

const rootPath = path.join(__dirname, '../../example/vueFiles/');
const defaults = new Models.Defaults();

test('correctPath Path', t => {
    const filePath = path.join(rootPath, '../../example/vueFiles/components/uuid.vue');
    const correctPath = rootPath + 'components/uuid.vue';

    return PathUtils.getCorrectPathForFile(filePath, 'view', defaults)
        .then(returnedPath => {
            t.is(returnedPath.path, correctPath);
        })

});


test('shows error for fake test Path ', t => {

    const filePath = path.join(rootPath, 'componentDoesntExist.vue');
    const errMessage = `Could not find test file at ${rootPath}componentDoesntExist.vue`

    return PathUtils.getCorrectPathForFile(filePath, 'test', defaults)
        .catch(error => {
            console.log(error)
            t.is(error.message, errMessage);
        })
});
