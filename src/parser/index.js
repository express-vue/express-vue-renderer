// @flow
const styleParser = require('./style');
const htmlParser = require('./html');
const scriptParser = require('./script');
const componentParser = require('./component');

module.exports.componentParser = componentParser;
module.exports.scriptParser = scriptParser;
module.exports.styleParser = styleParser;
module.exports.htmlParser = htmlParser;
