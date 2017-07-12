// @flow
const pug        = require('pug');
const htmlMinify = require('html-minifier');

const htmlRegex = /(<template.*?>)([\s\S]*)(<\/template>)/gm;

function htmlParser(body: string, regex: RegExp, minify: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!regex) {
            regex = htmlRegex;
        }
        if (!body) {
            reject(new Error('No template section'));
        } else {
            const bodyArray = body.match(htmlRegex);
            let bodyString  = bodyArray[0];
            if (bodyString) {
                const templateLang = bodyString.replace(htmlRegex, '$1');
                bodyString = bodyString.replace(htmlRegex, '$2');
                if(templateLang.includes('lang="pug"') || templateLang.includes('lang="jade"')) {
                    bodyString = pug.compile(bodyString,{})({});
                }
                if (minify) {
                    bodyString = htmlMinify.minify(bodyString, {
                        collapseWhitespace: true
                    });
                }
            }
            resolve(bodyString);
        }
    });
}


module.exports = htmlParser;
