// @flow
const CleanCSS = require('clean-css');

type StyleObjectType = {
    type: 'string',
    content: 'string',
    start: number,
    attrs: Object,
    lang: { lang: string },
    end: number
 }

function styleParser(styleObjectArray: StyleObjectType[]): Promise<string> {
    return new Promise((resolve) => {
        let output = '';
        if (styleObjectArray && styleObjectArray.length > 0) {
            for (const styleObject of styleObjectArray) {
                if(styleObject.lang === 'scss' || styleObject.lang === 'less') {
                    console.error('Sorry please only use plain CSS in your files for now');
                }
                output += new CleanCSS({}).minify(styleObject.content).styles;
            }
        }
        resolve(output);
    });
}

module.exports = styleParser;
