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
        // try to get the component content from the cache
        const cachedComponentContent = defaults.cache.get(templatePath);
        if (cachedComponentContent) {
            parseContent(cachedComponentContent, templatePath, defaults, type)
                .then(contentObject => {
                    resolve(contentObject);
                })
                .catch(error => {
                    reject(error);
                });
        } else {
            fs.readFile(templatePath, 'utf-8', function (err, content) {
                if (err) {
                    let error = `Could Not Find Component, I was expecting it to live here \n${templatePath} \nBut I couldn't find it there, ¯\\_(ツ)_/¯\n\n`;
                    reject(error);
                } else {
                    // set the cache for the component
                    defaults.cache.set(templatePath, content);

                    parseContent(content, templatePath, defaults, type)
                        .then(contentObject => {
                            resolve(contentObject);
                        })
                        .catch(error => {
                            reject(error);
                        });
                }
            });
        }
    });
}

function parseContent(content: string, templatePath: string, defaults: Object, type: string): Promise<Object> {
    return new Promise((resolve, reject) => {
        const templateArray = templatePath.split('/');
        if (templateArray.length === 0) {
            let error = `I had an error processing component templates. in this file \n${templatePath}`;
            console.error(new Error(error));
            return error;
        } else {
            let templateName = templateArray[templateArray.length - 1].replace('.vue', '');
            const promiseArray = [
                htmlParser(content, htmlRegex, true),
                scriptParser(content, defaults, type, scriptRegex),
                styleParser(content, styleRegex)
            ];

            Promise.all(promiseArray)
                .then(resultsArray => {
                    const body = resultsArray[0];
                    const script = resultsArray[1];
                    const style = resultsArray[2];

                    let componentScript = script || {};
                    componentScript.template = body;

                    const componentObject = {
                        type: type,
                        style: style,
                        name: camelCase(templateName),
                        script: componentScript
                    };
                    resolve(componentObject);
                })
                .catch(error => {
                    reject(error);
                });
        }
    });
}

module.exports.componentParser = componentParser;
module.exports.scriptParser = scriptParser;
module.exports.styleParser = styleParser;
module.exports.htmlParser = htmlParser;
