// @flow
const CleanCSS = require('clean-css');

const styleRegex = /(<style.*?>)([\s\S]*?)(<\/style>)/gm;

function styleParser(template: string, regex: RegExp): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!regex) {
            regex = styleRegex;
        }
        if (!template) {
            reject(new Error('missing style section'));
        }
        const styleArray = template.match(regex) || [];
        let styleString  = styleArray[0];
        let finalStyleString = '';
        if (styleString) {
            finalStyleString = styleString.replace(regex, '$2');

            const templateLang = styleString.replace(regex, '$1');
            if(templateLang.includes('lang="scss"') || templateLang.includes('lang="less"')) {
                console.error('Sorry please only use plain CSS in your files for now');
            }
        }
        const options = {};
        const output = new CleanCSS(options).minify(finalStyleString);
        resolve(output.styles);
    });
}

module.exports = styleParser;
