// @flow
const xss = require('xss');

function scriptToString(script: Object): string {
    let string = '';
    for (let member in script) {
        switch (typeof script[member]) {
        case 'function':
            if (member === 'data') {
                const dataObj = xss(JSON.stringify(script[member]()));
                string += `${member}: function(){return ${dataObj}},`;
            } else {
                string += member + ': ' + String(script[member]) + ',';
            }
            break;
        case 'object':
            if (member === 'data') {
                string += member + ': ' + xss(JSON.stringify(script[member])) + ',';
            } else if (script[member].constructor === Array) {
                string += member + ': ' + xss(JSON.stringify(script[member])) + ',';
            } else {
                string += member + ': ' + scriptToString(script[member]) + ',';
            }
            break;
        default:
            string += member + ': ' + JSON.stringify(script[member]) + ',';
            break;
        }
    }
    return `{${string}}`;
}

module.exports = scriptToString;
