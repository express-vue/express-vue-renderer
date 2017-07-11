import test   from 'ava';
import path from 'path';
import { PathUtils } from '../../src/utils';

const rootPath = path.join(__dirname, '../vueFiles/');

test('correctPath Path', t => {
    const filePath = 'components/uuid.vue';
    const correctPath  = rootPath + 'components/uuid.vue';

    return PathUtils.getCorrectPathForFile(filePath, rootPath, 'view')
        .then(returnedPath => {
            t.is(returnedPath.path, correctPath);
        })

});


test('shows error for fake test Path ', t => {

    const filePath = 'componentDoesntExist.vue';
    const errMessage = `Could not find test file at ${rootPath}componentDoesntExist.vue`

    return PathUtils.getCorrectPathForFile(filePath, rootPath, 'test')
    .catch(error => {
        t.is(error.message, errMessage);
    })
});
