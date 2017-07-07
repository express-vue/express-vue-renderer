// @flow
const fs = require('fs');

const camelCase = require('camel-case');
const styleParser = require('./style');
const htmlParser = require('./html');
const scriptParser = require('./script');

const htmlRegex = /(<template.*?>)([\s\S]*)(<\/template>)/gm;
const scriptRegex = /(<script.*?>)([\s\S]*?)(<\/script>)/gm;
const styleRegex = /(<style.*?>)([\s\S]*?)(<\/style>)/gm;

function componentParser(templatePath: string, defaults: Object, type: string): Promise < Object > {
    return new Promise(function (resolve, reject) {
        defaults.cache.get(templatePath, (error, cachedComponentContent) => {
            if (error) {
                reject(new Error(error));
            } else if (cachedComponentContent) {
                const componentObject = parseContent(cachedComponentContent, templatePath, defaults, type);
                if (typeof componentObject === Error) {
                    reject(componentObject);
                } else {
                    resolve(componentObject);
                }
            } else {
                fs.readFile(templatePath, 'utf-8', function (err, content) {
                    if (err) {
                        let error = `Could Not Find Component, I was expecting it to live here \n${templatePath} \nBut I couldn't find it there, ¯\\_(ツ)_/¯\n\n`;
                        console.error(new Error(error));
                        reject(error);
                    } else {
                        // set the cache for the component
                        defaults.cache.set(templatePath, content, error => {
                            if (error) {
                                reject(new Error(error));
                            } else {
                                const componentObject = parseContent(content, templatePath, defaults, type);
                                if (typeof componentObject === Error) {
                                    reject(componentObject);
                                } else {
                                    resolve(componentObject);
                                }
                            }
                        });
                    }
                });
            }
        });

    });
}

function parseContent(content: string, templatePath: string, defaults: Object, type: string): Object {
    const body = htmlParser(content, htmlRegex, true);
    content = content.replace(htmlRegex, '');

    const script = scriptParser(content, defaults, type, scriptRegex);
    const templateArray = templatePath.split('/');

    const style = styleParser(content, styleRegex);
    content = content.replace(styleRegex, '');

    if (templateArray.length === 0) {
        let error = `I had an error processing component templates. in this file \n${templatePath}`;
        console.error(new Error(error));
        return error;
    }

    let templateName = templateArray[templateArray.length - 1].replace('.vue', '');
    let componentScript = script || {};
    componentScript.template = body;

    const componentObject = {
        type: type,
        style: style,
        name: camelCase(templateName),
        script: componentScript
    };
    return componentObject;
}

module.exports.componentParser = componentParser;
module.exports.scriptParser = scriptParser;
module.exports.styleParser = styleParser;
module.exports.htmlParser = htmlParser;
