// @flow
const pug        = require('pug');
const htmlMinify = require('html-minifier');

type TemplateObjectType = {
    type: 'string',
    content: 'string',
    start: number,
    attrs: { lang: 'string' },
    lang: 'string',
    end: number
 }

function htmlParser(templateObject: TemplateObjectType, minify: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
        let parsedString = '';
        if (!templateObject && templateObject.content) {
            reject(new Error('No template section'));
        } else {
            if(templateObject.lang === 'pug' || templateObject.lang === 'jade') {
                parsedString = pug.compile(templateObject.content,{})({});
            }
            if (minify) {
                if (parsedString === '') {
                    parsedString = htmlMinify.minify(templateObject.content, {
                        collapseWhitespace: true
                    });
                } else {
                    parsedString = htmlMinify.minify(parsedString, {
                        collapseWhitespace: true
                    });
                }
            }
            resolve(parsedString);
        }
    });
}


module.exports = htmlParser;
