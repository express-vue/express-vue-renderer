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
        defaults.cache.get(templatePath, (error, cachedComponent) => {
            if (error) {
                reject(new Error(error));
            } else if (cachedComponent) {
                resolve(cachedComponent);
            } else {
                fs.readFile(templatePath, 'utf-8', function (err, content) {
                    if (err) {
                        let error = `Could Not Find Component, I was expecting it to live here \n${templatePath} \nBut I couldn't find it there, ¯\\_(ツ)_/¯\n\n`;
                        console.error(new Error(error));
                        reject(error);
                    } else {
                        const body = htmlParser(content, htmlRegex, true);
                        content = content.replace(htmlRegex, '');

                        const script = scriptParser(content, defaults, type, scriptRegex);
                        const templateArray = templatePath.split('/');

                        const style = styleParser(content, styleRegex);
                        content = content.replace(styleRegex, '');

                        if (templateArray.length === 0) {
                            let error = `I had an error processing component templates. in this file \n${templatePath}`;
                            console.error(new Error(error));
                            reject(error);
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
                        // set the cache for the component
                        defaults.cache.set(templatePath, componentObject, error => {
                            if (error) {
                                reject(new Error(error));
                            } else {
                                resolve(componentObject);
                            }
                        });
                    }
                });
            }
        });

    });
}

module.exports.componentParser = componentParser;
module.exports.scriptParser = scriptParser;
module.exports.styleParser = styleParser;
module.exports.htmlParser = htmlParser;
