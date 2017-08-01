// @flow
const xss = require('xss');


function routesToString(routes: Object[]): string {
    let string = '';
    routes.forEach(script => string += scriptToString(script) + ',');
    return `[${string}]`;
}

function routeComponentsToString(script: Object): string {
    let string = '';
    for (let member in script) {
        string += member + ': __' + script[member] + ',';
    }
    return `{${string}}`;

function mixinsToString(mixins: Array < Object > ): string {
    var string = '';
    for (var mixin of mixins) {
        string += `${scriptToString(mixin)},`;
    }
    return string;
}

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
                } else if (member === 'routes' || member === 'children') {
                    string += member + ': ' + routesToString(script[member]) + ',';
                } else if (member === 'components' && script['routes'] !== undefined) { // Check if 'components' is from a router script.
                    string += member + ': ' + routeComponentsToString(script[member]) + ',';
                } else if (member === 'mixins') {
                    string += member + ': [' + mixinsToString(script[member]) + '],';
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

module.exports.scriptToString = scriptToString;
module.exports.mixinsToString = mixinsToString;
