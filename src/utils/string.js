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
}

function mixinsToString(mixins: Array < Object > ): string {
    var string = '';
    for (var mixin of mixins) {
        string += `${scriptToString(mixin)},`;
    }
    return string;
}

function scriptToString(script: Object): string {
    let rawString = '';
    if (typeof script === 'function') {
        rawString = `${String(script)}`;
    } else {
        for (let member in script) {
            switch (typeof script[member]) {
                case 'function':
                    if (member === 'data') {
                        const dataObj = xss(JSON.stringify(script[member]()));
                        rawString += `${member}: function(){return ${dataObj}},`;
                    } else {
                        rawString += member + ': ' + String(script[member]) + ',';
                    }
                    break;
                case 'object':
                    if (member === 'data') {
                        rawString += member + ': ' + xss(JSON.stringify(script[member])) + ',';
                    } else if (member === 'routes' || member === 'children') {
                        rawString += member + ': ' + routesToString(script[member]) + ',';
                    } else if (member === 'components' && script['path'] !== undefined) { // Checks if 'components' is in a route object
                        rawString += member + ': ' + routeComponentsToString(script[member]) + ',';
                    } else if (member === 'mixins') {
                        rawString += member + ': [' + mixinsToString(script[member]) + '],';
                    } else if (script[member].constructor === Array) {
                        rawString += member + ': ' + xss(JSON.stringify(script[member])) + ',';
                    } else if (member === 'props') {
                        const propsArray = Object.keys(script[member]);
                        rawString += member + ': ' + xss(JSON.stringify(propsArray)) + ',';
                    } else {
                        rawString += member + ': ' + scriptToString(script[member]) + ',';
                    }
                    break;
                default:
                    if (member === 'component' && script['path'] !== undefined) { // Checks if 'component' is in a route object
                        rawString += member + ': __' + script[member] + ',';
                    } else {
                        rawString += member + ': ' + JSON.stringify(script[member]) + ',';
                    }
                    break;
            }
        }
    }

    return `{${rawString}}`;
}

module.exports.scriptToString = scriptToString;
module.exports.mixinsToString = mixinsToString;
module.exports.routesToString = routesToString;
module.exports.routeComponentsToString = routeComponentsToString;
