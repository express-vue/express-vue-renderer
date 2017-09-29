// @flow
const xss = require('xss');

class PropClass {
    type: any;
    required: boolean;
    default: any;
    constructor(prop: any) {
        prop.required ? this.required = prop.required : null;
        prop.default ? this.default = prop.default : null;
    }
}

function routesToString(routes: Object[]): string {
    let routeString = '';
    routes.forEach(script => routeString += scriptToString(script) + ',');
    return `[${routeString}]`.replace(new RegExp(/,}/, 'g'), '}').replace(new RegExp(/,]/, 'g'), ']');
}

function routeComponentsToString(script: Object): string {
    let componentString = '';
    for (let member in script) {
        componentString += member + ': __' + script[member] + ',';
    }
    return `{${componentString}}`;
}

function mixinsToString(mixins: Array < Object > ): string {
    var mixinString = '';
    for (var mixin of mixins) {
        mixinString += `${scriptToString(mixin)},`;
    }
    return mixinString;
}

function propsToString(props: Object): string {
    let propString = '';
    if (props[Object.keys(props)[0]].type === null) {
        var propsArray = Object.keys(props);
        propString = xss(JSON.stringify(propsArray));
    } else {
        let tempProp = {};
        for (var prop in props) {
            if (props.hasOwnProperty(prop)) {
                var element = new PropClass(props[prop]);
                tempProp[prop] = element;
            }
        }
        propString = scriptToString(tempProp);
    }
    return propString;
}

function scriptToString(script: Object | any): string {
    let scriptString = '';
    for (let member in script) {
        switch (typeof script[member]) {
            case 'function':
                if (member === 'data') {
                    const dataObj = xss(JSON.stringify(script[member]()));
                    scriptString += `${member}: function(){return ${dataObj}},`;
                } else {
                    scriptString += member + ': ' + String(script[member]) + ',';
                }
                break;
            case 'object':
                if (member === 'data') {
                    scriptString += member + ': ' + xss(JSON.stringify(script[member])) + ',';
                } else if (member === 'routes' || member === 'children') {
                    scriptString += member + ': ' + routesToString(script[member]) + ',';
                } else if (member === 'components' && script['path'] !== undefined) { // Checks if 'components' is in a route object
                    scriptString += member + ': ' + routeComponentsToString(script[member]) + ',';
                } else if (member === 'mixins') {
                    scriptString += member + ': [' + mixinsToString(script[member]) + '],';
                } else if (script[member].constructor === Array) {
                    scriptString += member + ': ' + xss(JSON.stringify(script[member])) + ',';
                } else if (member === 'props') {
                    if (script[member][Object.keys(script[member])[0]].type === null) {
                        var propsArray = Object.keys(script[member]);
                        scriptString += member + ': ' + xss(JSON.stringify(propsArray)) + ',';
                    } else {
                        // scriptString += member + ': ' + scriptToString(script[member]) + ',';
                        const propsString = propsToString(script[member]);
                        scriptString += `${member}: ${propsString},`;
                    }

                } else {
                    scriptString += member + ': ' + scriptToString(script[member]) + ',';
                }
                break;
            default:
                if (member === 'component' && script['path'] !== undefined) { // Checks if 'component' is in a route object
                    scriptString += member + ': __' + script[member] + ',';
                } else {
                    scriptString += member + ': ' + JSON.stringify(script[member]) + ',';
                }
                break;
        }
    }
    let finalScriptString = `{${scriptString}}`.replace(new RegExp(/,}/, 'g'), '}').replace(new RegExp(/,]/, 'g'), ']');
    return finalScriptString;
}

module.exports.scriptToString = scriptToString;
module.exports.mixinsToString = mixinsToString;
module.exports.routesToString = routesToString;
module.exports.routeComponentsToString = routeComponentsToString;
