// @flow
//
const fs = require('fs');
const camelCase = require('camel-case');
const compiler = require('vue-template-compiler');
const styleParser = require('./style');
const htmlParser = require('./html');
const scriptParser = require('./script');


function componentParser(templatePath: string, defaults: Object, type: string, Cache: Object): Promise < Object > {
    return new Promise(function (resolve, reject) {
        // try to get the component content from the cache
        const cachedComponentContentObject = Cache.get(templatePath);
        if (cachedComponentContentObject) {
            scriptParser(cachedComponentContentObject.parsedContent.script, defaults, type, Cache).then(parsedScriptObject => {
                cachedComponentContentObject.script = parsedScriptObject;
                cachedComponentContentObject.script.template = cachedComponentContentObject.template;
                cachedComponentContentObject.styles = parsedScriptObject.styles;
                resolve(cachedComponentContentObject);
            }).catch(error => {
                reject(error);
            });
        } else {
            fs.readFile(templatePath, 'utf-8', function (err, content) {
                if (err) {
                    let error = `Could Not Find Component, I was expecting it to live here \n${templatePath} \nBut I couldn't find it there, ¯\\_(ツ)_/¯\n\n`;
                    reject(error);
                } else {
                    parseContent(content, templatePath, defaults, type, Cache).then(contentObject => {
                        // set the cache for the component
                        Cache.set(templatePath, contentObject);
                        resolve(contentObject);
                    }).catch(error => {
                        reject(error);
                    });
                }
            });
        }
    });
}

function parseContent(content: string, templatePath: string, defaults: Object, type: string, Cache: Object): Promise < Object > {
    return new Promise((resolve, reject) => {
        const templateArray = templatePath.split('/');
        if (templateArray.length === 0) {
            let error = `I had an error processing component templates. in this file \n${templatePath}`;
            console.error(new Error(error));
            reject(error);
        } else if (content) {
            let templateName = templateArray[templateArray.length - 1].replace('.vue', '');

            //Setup official component parser..
            const parsedContent = compiler.parseComponent(content);
            if (!parsedContent.template && !parsedContent.script && !parsedContent.styles) {
                reject(new Error(`Could not parse the file at ${templatePath}`));
            } else {

                const promiseArray = [
                    htmlParser(parsedContent.template, true),
                    scriptParser(parsedContent.script, defaults, type, Cache),
                    styleParser(parsedContent.styles)
                ];

                Promise.all(promiseArray).then(resultsArray => {
                    const template = resultsArray[0];
                    const script = resultsArray[1];
                    // console.log(resultsArray[2]);
                    let style = '';
                    if (resultsArray[2]) {
                        style = resultsArray[2];
                    } else {
                        style = resultsArray[1].styles ? resultsArray[1].styles : '';
                    }

                    script.template = template;

                    const componentObjectCTOR = {
                        template: template,
                        parsedContent: parsedContent,
                        type: type,
                        style: style,
                        name: camelCase(templateName),
                        script: script
                    };
                    resolve(componentObjectCTOR);
                }).catch(error => {
                    reject(error);
                });
            }
        } else {
            reject(new Error(`missing content block from ${templatePath} something went wrong with loading the file`));
        }
    });
}

module.exports = componentParser;
