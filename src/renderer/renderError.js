// @flow

function renderError(error: string): Object {
    console.error(error);
    return new Error(error);
}

module.exports = renderError;
